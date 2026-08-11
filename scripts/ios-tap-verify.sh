#!/bin/zsh
# Assert-based iOS Simulator tap verification (idb + accessibility).
#
# Host clicks / silent tap-and-screenshot can no-op when the idb companion
# drops. This harness refuses to treat a screenshot as proof unless:
#   1) the companion is reachable,
#   2) the tap command succeeds,
#   3) accessibility labels match an expected needle after the tap.
#
# Prerequisites (host): idb_companion, idb (fb-idb), python3, rg, xcrun simctl
#
# Usage — source as a library from a milestone script:
#   source "$(dirname "$0")/../scripts/ios-tap-verify.sh"
#   ios_tap_init
#   tap_exact "Currency" "open-currency"
#   assert_has "Select currency"
#   shot "B1-currency"
#
# Usage — smoke-check companion + dump labels:
#   scripts/ios-tap-verify.sh --self-check
#   scripts/ios-tap-verify.sh --labels
#
# Env overrides:
#   UDID, BUNDLE_ID, OUT, IDB_SOCK, IOS_TAP_LOG, IDB_PATH

set -euo pipefail

BUNDLE_ID="${BUNDLE_ID:-com.hasabaty.app}"
IDB_SOCK="${IDB_SOCK:-/tmp/hasabaty-idb.sock}"
IOS_TAP_LOG="${IOS_TAP_LOG:-/tmp/hasabaty-ios-tap-verify.log}"
OUT="${OUT:-.tmp-verify/ios}"

# Prefer user-local fb-idb without hard-coding a single machine user.
export PATH="${HOME}/Library/Python/3.9/bin:${HOME}/Library/Python/3.12/bin:/opt/homebrew/bin:${PATH}"
if [[ -n "${IDB_PATH:-}" ]]; then
  export PATH="${IDB_PATH}:${PATH}"
fi

ios_tap_log() {
  echo "$@" | tee -a "$IOS_TAP_LOG"
}

ios_tap_resolve_udid() {
  if [[ -n "${UDID:-}" ]]; then
    return 0
  fi
  UDID="$(xcrun simctl list devices booted 2>/dev/null | rg -o '[0-9A-F-]{36}' | head -1 || true)"
  if [[ -z "${UDID}" ]]; then
    ios_tap_log "ERROR: no booted Simulator — set UDID= or boot one first"
    return 1
  fi
  ios_tap_log "UDID=$UDID"
}

ios_tap_init() {
  : > "$IOS_TAP_LOG"
  mkdir -p "$OUT"
  ios_tap_resolve_udid
  ensure_comp
}

ensure_comp() {
  ios_tap_resolve_udid
  if [[ -S "$IDB_SOCK" ]] &&
    idb --companion "$IDB_SOCK" ui describe-all --udid "$UDID" --json >/dev/null 2>&1; then
    return 0
  fi
  ios_tap_log "COMPANION_RESTART"
  pkill -f idb_companion 2>/dev/null || true
  rm -f "$IDB_SOCK"
  sleep 1
  idb_companion --udid "$UDID" --grpc-domain-sock "$IDB_SOCK" \
    > /tmp/hasabaty-idb-companion.log 2>&1 &
  ios_tap_log "spawned companion $!"
  local _i
  for _i in {1..12}; do
    sleep 1
    if [[ -S "$IDB_SOCK" ]] &&
      idb --companion "$IDB_SOCK" ui describe-all --udid "$UDID" --json >/dev/null 2>&1; then
      ios_tap_log "COMPANION_READY"
      return 0
    fi
  done
  ios_tap_log "COMPANION_FAILED"
  tail -30 /tmp/hasabaty-idb-companion.log | tee -a "$IOS_TAP_LOG"
  return 1
}

labels_json() {
  ensure_comp
  idb --companion "$IDB_SOCK" ui describe-all --udid "$UDID" --json 2>/dev/null
}

labels_tsv() {
  labels_json | python3 -c '
import sys, json
d = json.load(sys.stdin)
for x in d:
    lab = x.get("AXLabel") or ""
    if not lab:
        continue
    f = x["frame"]
    print("%s\t%d %d" % (lab, int(f["x"] + f["width"] / 2), int(f["y"] + f["height"] / 2)))
'
}

assert_has() {
  local needle="$1"
  local blob
  blob="$(labels_tsv)"
  if ! print -r -- "$blob" | rg -q "$needle"; then
    ios_tap_log "ASSERT_FAIL expected='$needle'"
    print -r -- "$blob" | head -40 | tee -a "$IOS_TAP_LOG"
    return 1
  fi
  ios_tap_log "ASSERT_OK expected='$needle'"
}

center_of_exact() {
  local exact="$1"
  labels_tsv | python3 -c '
import sys
exact = sys.argv[1]
for line in sys.stdin:
    lab, rest = line.rstrip("\n").split("\t", 1)
    if lab == exact:
        print(rest)
        break
' "$exact"
}

center_of_contains() {
  local needle="$1"
  labels_tsv | python3 -c '
import sys
needle = sys.argv[1].lower()
for line in sys.stdin:
    lab, rest = line.rstrip("\n").split("\t", 1)
    if needle in lab.lower():
        print(rest)
        break
' "$needle"
}

# Prefer left-most AX hit when duplicate labels exist (e.g. toggle + title).
center_of_leftmost_exact() {
  local exact="$1"
  labels_tsv | python3 -c '
import sys
exact = sys.argv[1]
rows = []
for line in sys.stdin:
    lab, rest = line.rstrip("\n").split("\t", 1)
    if lab == exact:
        x, y = map(int, rest.split())
        rows.append((x, y))
rows.sort()
if rows:
    print("%d %d" % rows[0])
' "$exact"
}

tap_xy() {
  local x="$1" y="$2" name="$3"
  ensure_comp
  ios_tap_log "TAP_BEGIN $name ($x,$y)"
  local err
  err="$(mktemp)"
  if ! idb --companion "$IDB_SOCK" ui tap --udid "$UDID" "$x" "$y" 2>"$err"; then
    cat "$err" | tee -a "$IOS_TAP_LOG"
    rm -f "$err"
    ios_tap_log "TAP_FAIL $name"
    return 1
  fi
  if rg -q "Failed to connect" "$err"; then
    cat "$err" | tee -a "$IOS_TAP_LOG"
    rm -f "$err"
    ios_tap_log "TAP_FAIL $name (companion dropped)"
    return 1
  fi
  cat "$err" >>"$IOS_TAP_LOG" 2>/dev/null || true
  rm -f "$err"
  sleep 1.3
  ios_tap_log "TAP_OK $name"
}

tap_exact() {
  local lab="$1" name="${2:-$1}"
  local xy
  xy="$(center_of_exact "$lab")"
  if [[ -z "$xy" ]]; then
    ios_tap_log "MISSING_EXACT '$lab'"
    labels_tsv | head -40 | tee -a "$IOS_TAP_LOG"
    return 1
  fi
  # zsh: split "x y" into two args
  tap_xy ${=xy} "$name"
}

tap_contains() {
  local needle="$1" name="${2:-$1}"
  local xy
  xy="$(center_of_contains "$needle")"
  if [[ -z "$xy" ]]; then
    ios_tap_log "MISSING_CONTAINS '$needle'"
    labels_tsv | head -40 | tee -a "$IOS_TAP_LOG"
    return 1
  fi
  tap_xy ${=xy} "$name"
}

tap_leftmost_exact() {
  local lab="$1" name="${2:-$1}"
  local xy
  xy="$(center_of_leftmost_exact "$lab")"
  if [[ -z "$xy" ]]; then
    ios_tap_log "MISSING_LEFTMOST '$lab'"
    labels_tsv | head -40 | tee -a "$IOS_TAP_LOG"
    return 1
  fi
  tap_xy ${=xy} "$name"
}

shot() {
  local name="$1"
  ios_tap_resolve_udid
  xcrun simctl io "$UDID" screenshot "$OUT/$name.png"
  ios_tap_log "SHOT $name -> $OUT/$name.png"
}

app_data_dir() {
  ios_tap_resolve_udid
  xcrun simctl get_app_container "$UDID" "$BUNDLE_ID" data
}

app_db_path() {
  find "$(app_data_dir)" -name 'hasabaty.db' 2>/dev/null | head -1
}

launch_app() {
  ios_tap_resolve_udid
  xcrun simctl terminate "$UDID" "$BUNDLE_ID" 2>/dev/null || true
  sleep 1
  xcrun simctl launch "$UDID" "$BUNDLE_ID"
  sleep "${1:-8}"
  ensure_comp
}

# Absolute path to this file (stable even inside functions, where $0 is the fn name).
IOS_TAP_VERIFY_SCRIPT="${IOS_TAP_VERIFY_SCRIPT:-${(%):-%x}}"
if [[ "$IOS_TAP_VERIFY_SCRIPT" != /* ]]; then
  IOS_TAP_VERIFY_SCRIPT="$(cd "$(dirname "$IOS_TAP_VERIFY_SCRIPT")" && pwd)/$(basename "$IOS_TAP_VERIFY_SCRIPT")"
fi

# --- CLI entrypoints when executed (not sourced) ---
ios_tap_main() {
  case "${1:-}" in
    --self-check)
      ios_tap_init
      ios_tap_log "self-check OK (companion + describe-all)"
      labels_tsv | head -20
      ;;
    --labels)
      ios_tap_init
      labels_tsv
      ;;
    -h|--help|"")
      sed -n '2,28p' "$IOS_TAP_VERIFY_SCRIPT"
      ;;
    *)
      echo "Unknown option: $1" >&2
      echo "Use --self-check, --labels, or source this file as a library." >&2
      return 1
      ;;
  esac
}

# If sourced, expose helpers only. If executed, run CLI.
if [[ "${ZSH_EVAL_CONTEXT:-}" != *:file* ]]; then
  ios_tap_main "$@"
fi
