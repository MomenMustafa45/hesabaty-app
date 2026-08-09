# حساباتي — Technical Architecture

**Status:** Step 2 in progress. This document is the single source of truth for the React Native build — hand it to Cursor alongside the HTML prototype. It grows section by section as decisions get locked; nothing here should contradict the prototype's validated design and behavior.

---

## 1. Foundational stack (locked)

| Concern                  | Choice                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework                | React Native CLI (bare, no Expo), new architecture                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Language                 | TypeScript                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Package manager          | bun                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Local database           | `@op-engineering/op-sqlite`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Key-value storage        | MMKV (settings, preferences — mirrors the reference project's pattern). `react-native-mmkv@4.x` is Nitro Modules-based and requires `react-native-nitro-modules` as a peer dependency — surfaced by Cursor during M0, approved, now part of the locked stack.                                                                                                                                                                                                                                                                                                                                            |
| Client state             | Zustand (settings/app state)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Async data layer         | React Query — wraps local SQLite reads/writes too, not just network calls, giving loading/refetch semantics for free even with no backend                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Navigation               | React Navigation — native bottom tabs via `createNativeBottomTabNavigator` from `@react-navigation/bottom-tabs/unstable`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| i18n                     | i18next + react-i18next + react-native-localize; RTL handled via `I18nManager` + full app restart on language change (native RTL cannot flip live like the HTML prototype does)                                                                                                                                                                                                                                                                                                                                                                                                                          |
| App restart (for RTL)    | `react-native-restart` — triggers a fast in-app reload after `I18nManager.forceRTL()` so the new layout direction actually takes effect                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Theming                  | `ThemeProvider` resolving light/dark from system `Appearance` + MMKV-persisted override                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Notifications            | TBD — sub-step 8                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Gesture-driven animation | `react-native-reanimated@4.x` (requires new architecture — confirmed compatible with RN 0.86.2) **+ `react-native-worklets`** (required peer dependency as of Reanimated 4 — the worklets runtime was split into its own package; not optional) — pairs with `react-native-gesture-handler` (already a required peer dep of the bottom tabs navigator) for `BottomSheet`'s drag-to-dismiss. Babel plugin is `react-native-worklets/plugin` (not `react-native-reanimated/plugin` — changed in v4), must be last in the plugins array. Approved during M1 review, applies retroactively to `BottomSheet`. |
| App identity             | Internal/technical name `Hasabaty`; on-device display name `حساباتي`; bundle ID / application ID `com.hasabaty.app` (iOS + Android)                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

**Known risk flagged for Cursor:** the native bottom tabs API is genuinely unstable as the name says — as of now there's an open Android bug where returning from a screen outside the tab navigator can blank out tab content, and an iOS label-positioning glitch on first render. Test the "tab → screen outside tabs → back" flow early, not at the end. Tab bar icons must be image assets (native constraint) — everywhere else in the app, our hand-drawn SVG icon set carries over directly.

**RTL implementation, precisely (for M10):** React Native has no `direction` style prop equivalent to HTML's `dir` attribute — the real mechanism is `I18nManager`. On language change: `i18n.changeLanguage(lang)` → persist the choice to MMKV → `I18nManager.allowRTL(isArabic)` + `I18nManager.forceRTL(isArabic)` → `RNRestart.restart()`. On every cold start, read the persisted language and call `I18nManager.forceRTL()` again _before_ the root component mounts (same pattern as the reference project's `i18n.ts` init) so direction is correct from launch, not only after a manual switch.

**Standing pattern, caught during M5:** for anything absolutely-positioned that needs to mirror in RTL (the FAB, and likely others later — Insights, any future floating elements), use RN's locale-aware `end`/`start` properties, not manual `left`/`right` + `I18nManager.isRTL` conditionals. The manual version passed a casual code read but was actually wrong (stayed on the physical right in RTL) until measured with a real screenshot — `end`/`start` lets the layout engine handle the mirroring correctly by construction, rather than relying on a conditional being written correctly every single time.

---

## 2. Folder structure

Feature-first, matching the reference project's conventions exactly — no new patterns invented.

**Every component and screen, without exception, lives in its own folder** — never a flat `Name.tsx` file sitting directly in a parent directory. Each folder holds the same triple as the reference project: `Name.tsx`, `Name.styles.ts` (a `createStyles(theme)` factory, not static `StyleSheet.create` used directly), and `index.ts` re-exporting it. Example: `src/components/AppText/{AppText.tsx, AppText.styles.ts, index.ts}` — not `src/components/AppText.tsx`. **Scope: this applies to everything under `components/` and `features/*/screens/` (and `features/*/components/`) — genuine UI that renders visual content.** It does not apply to `navigations/`, `providers/`, `store/`, `lib/`, `storage/`, `config/`, `types/`, or `locales/` — those stay as flat files (`RootNavigator.tsx`, `ThemeProvider.tsx`, `settingsStore.ts`, etc.), matching the reference project's own literal structure, unless a specific file genuinely needs a colocated stylesheet later.

```
src/
  features/
    onboarding/
      screens/           WelcomeScreen, CurrencyStepScreen, CycleAndLimitStepScreen,
                          NotificationPermissionStepScreen (keeps the "Screen" suffix used
                          everywhere else; "Step" is infixed to avoid colliding with
                          Settings' own CurrencyScreen below)
    home/
      screens/           HomeScreen
      components/        SpendRing, StatCards, RecentTransactionsList
      hooks/             useCurrentCycleStats
    transactions/
      screens/           AddTransactionSheet (dual-purpose: add and edit are the same sheet,
                          driven by an optional editingTransaction prop — not two components)
      components/        CategoryChips, AmountInput, RepeatToggle
      api/               transactionsApi.ts, transactionsQueryKeys.ts
      hooks/             useTransactions, useAddTransaction, useUpdateTransaction, useDeleteTransaction
    categories/
      api/               categoriesApi.ts, categoriesQueryKeys.ts (read-layer only — used by
                          transactions, history, insights, settings; management UI stays in settings/)
      hooks/             useCategories
    history/
      screens/           HistoryScreen, MonthPickerSheet
      hooks/             useMonthTransactions
    insights/
      screens/           InsightsScreen
      components/        MonthlyBarChart, CategoryDonut, BestMonthToggle
      hooks/             useMonthlyStats, useBestMonth
    rollover/
      screens/           NewMonthScreen
      hooks/             usePendingRecurring
    settings/
      screens/           SettingsScreen, CurrencyScreen, CycleLimitScreen, CategoriesScreen,
                          NotificationSettingsScreen, ExportImportScreen, AboutScreen
      api/               exportImportApi.ts
  components/            AppText, AppButton, AppCard, AppInput, AppDate, AppChip, AppToggle, AppBadge,
                          AppIcon, BottomSheet, EmptyState  (shared design-system components)
  hooks/                 useCycleRange, useCurrency  (shared, cross-feature)
  lib/                   db.ts (op-sqlite instance + migrations), queryClient.ts, dateUtils.ts, currencyUtils.ts
  config/                theme.ts, scaling.ts
  models/                transaction.ts, category.ts, settings.ts
  store/                 settingsStore.ts  (currency, monthlyLimit, cycleType, cycleStartDay, onboarded — Zustand + MMKV persist)
  storage/               mmkv.ts, storage.ts, keys.ts
  navigations/           RootNavigator, AppNavigator (native bottom tabs), types.ts, tabBarIcons.ts
  providers/              AppProviders, ThemeProvider
  locales/                i18n.ts, localizationKeys.ts, en.json, ar.json
  assets/
    fonts/                Cairo-*.ttf
    icons/                tab-bar PNGs (native tab bar requirement — see risk note above)
```

## 3. Path aliases

The reference project's existing alias set covers حساباتي almost one-for-one, with one change: `@types` is renamed to **`@models`** — caught during M3, since `@types/` is a reserved npm/TypeScript convention (where `@types/react`, `@types/node`, etc. live) and a path alias with that exact name causes real module-resolution conflicts, not just a style clash.
`@components`, `@features`, `@navigations`, `@lib`, `@config`, `@models`, `@assets`, `@hooks`, `@store`, `@providers`, `@storage`, `@locales`.

Same rule applies as the reference doc states: `babel.config.js`, `tsconfig.json` (`paths`), and `jest.config.js` (`moduleNameMapper`) must all stay in sync whenever this list changes.

## 4. Data model

Two SQLite tables via `@op-engineering/op-sqlite`. Settings (currency, monthly limit, cycle type/start day, onboarded flag, notification prefs, theme/language preference) live in Zustand + MMKV, not here — they're single-row config, not relational data.

### 4.1 `transactions`

| Column        | Type               | Notes                                                                                                                                                                                                                                    |
| ------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`          | `TEXT PRIMARY KEY` | UUID, not autoincrement — locked back in Step 1 so the schema is sync-ready if cloud backup happens later. Generation method is Cursor's call; verify what's actually available/compatible in this RN/Hermes setup before picking one.   |
| `type`        | `TEXT`             | `'expense'` \| `'income'`                                                                                                                                                                                                                |
| `category_id` | `TEXT`             | FK → `categories.id`                                                                                                                                                                                                                     |
| `amount`      | `INTEGER`          | **Minor units (piastres), not a float.** Storing money as `REAL` risks floating-point rounding errors — standard practice for financial data is integer minor-units, divided by 100 only at display time. 50.00 EGP is stored as `5000`. |
| `description` | `TEXT`             | nullable                                                                                                                                                                                                                                 |
| `date`        | `TEXT`             | ISO date `YYYY-MM-DD`, matching the prototype's convention                                                                                                                                                                               |
| `recurring`   | `INTEGER`          | 0/1 boolean                                                                                                                                                                                                                              |
| `created_at`  | `TEXT`             | ISO timestamp                                                                                                                                                                                                                            |
| `updated_at`  | `TEXT`             | ISO timestamp                                                                                                                                                                                                                            |

Indexes on `date`, `category_id`, and `type` — Home/History/Insights all filter by date range and category constantly.

### 4.2 `categories`

| Column       | Type               | Notes                                                                                                                                                                                                  |
| ------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`         | `TEXT PRIMARY KEY` | Default categories use fixed semantic slugs (`electricity`, `food`, ...) matching Section 6.5 and the seed data below. User-added custom categories get a generated UUID, same policy as transactions. |
| `type`       | `TEXT`             | `'expense'` \| `'income'`                                                                                                                                                                              |
| `label_en`   | `TEXT`             |                                                                                                                                                                                                        |
| `label_ar`   | `TEXT`             |                                                                                                                                                                                                        |
| `color`      | `TEXT`             | hex, matches Section 6.5                                                                                                                                                                               |
| `is_default` | `INTEGER`          | 0/1 — protects the last-remaining default category from deletion, matching the prototype's rule                                                                                                        |
| `sort_order` | `INTEGER`          |                                                                                                                                                                                                        |

### 4.3 Seed data (insert on first run, exact values from the prototype)

**Expense:** `electricity` (`#C89B3C`, Electricity / الكهرباء), `water` (`#3B8AD4`, Water / المياه), `food` (`#D2472E`, Food / الطعام), `transport` (`#7C6FE0`, Transport / المواصلات), `rent` (`#5B6B73`, Rent / الإيجار), `phone` (`#0B6B57`, Phone/Internet / الهاتف والإنترنت), `shopping` (`#D4527E`, Shopping / التسوق), `health` (`#C23B3B`, Health / الصحة), `entertainment` (`#9455C9`, Entertainment / الترفيه), `other` (`#8A8880`, Other / أخرى).

**Income:** `salary` (`#0B6B57`, Salary / الراتب), `freelance` (`#3B8AD4`, Freelance / عمل حر), `gift` (`#D4527E`, Gift / هدية), `other_income` (`#8A8880`, Other income / دخل آخر).

### 4.4 Migrations

`op-sqlite` has no built-in migration framework — it's a low-level driver, not an ORM. Use a simple versioned approach: numbered SQL migration files run in sequence, tracked via SQLite's own `PRAGMA user_version`, applied once on app startup. This isn't optional scaffolding — the schema _will_ change across later milestones (recurring-transaction handling, export/import), so a real migration path from day one avoids a painful retrofit.

### 4.5 React Query layer

Matches the reference project's pattern exactly, just pointed at local SQLite instead of a network call: `features/transactions/api/transactionsApi.ts` (raw `op-sqlite` queries), `transactionsQueryKeys.ts` (centralized keys), and `hooks/` wrapping each as `useTransactions` (query) plus `useAddTransaction`/`useUpdateTransaction`/`useDeleteTransaction` (mutations, invalidating the relevant query keys on success).

**First prompt to give Cursor (Milestone 3):**

> Read Section 4 of `hasabaty-architecture.md` fully. Build the SQLite schema and migration system exactly as specified — integer minor-units for `amount`, not floats; UUID text primary keys; the versioned-migration approach via `PRAGMA user_version`, not direct table creation with no upgrade path. Seed the exact default categories from 4.3 on first run. Then build the React Query layer per 4.5. Add a temporary debug screen (same throwaway pattern as M1's gallery, clearly marked for deletion) listing raw rows from both tables so we can verify the schema and seed data actually work before any real screen depends on it. Before writing code, confirm your approach for UUID generation (what's actually compatible with this RN/Hermes setup) and tell me your plan. Same rigor as every milestone — verify on both platforms, show me actual proof, not just a written claim.

---

## 5. Milestone plan & Cursor workflow

Each milestone is a single, scoped prompt to Cursor's Agent — never "build the whole app." After each one: run the app yourself against the "verify" column, read Cursor's changelog, then bring both back for review before greenlighting the next milestone.

**Standing note on Android verification:** the headless Android emulator in this environment has repeatedly crashed (GPU/display-surface errors) partway through automated screenshot capture (first seen M3, recurred M4). Treat this as expected, not a one-off — Cursor should still attempt automated Android verification where reasonable (build success, logcat checks), but a local `bun run android` pass by the human is the reliable way to confirm anything visual on Android, every milestone, not just when the automated attempt happens to fail.

| #   | Milestone              | Cursor builds                                                                                          | You verify                                                                                    |
| --- | ---------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| M0  | Scaffold               | RN CLI init, folder structure, path aliases, deps installed, blank app boots                           | App runs on simulator; folders match Section 2                                                |
| M1  | Design tokens + system | `theme.ts` + AppText/AppButton/AppCard/AppInput/AppChip/AppToggle, shown on a temporary gallery screen | Gallery screen matches prototype colors/spacing by eye                                        |
| M2  | Navigation shell       | Tabs + stacks wired with placeholder screens                                                           | Tap every tab; specifically test tab → screen outside tabs → back (the known native-tabs bug) |
| M3  | Data layer             | SQLite schema, migrations, seeded default categories, React Query hooks                                | Temporary debug screen listing raw DB rows                                                    |
| M4  | Onboarding             | Full flow wired to real data (currency, cycle, limit, notification permission)                         | Walk through onboarding on a real device/simulator                                            |
| M5  | Home + Add Transaction | Dual-ring dashboard, quick-add sheet, recent list                                                      | Add/edit/delete a transaction end to end                                                      |
| M6  | History + month picker | Grouped list, month navigation, jump-to-month sheet                                                    | Browse several months of seeded/test data                                                     |
| M7  | Insights               | Monthly bar chart, category donut, best-month toggle                                                   | Numbers match what History shows for the same months                                          |
| M8  | Settings + rollover    | All settings sub-screens, new-month recurring-confirm flow                                             | Change every setting; run the rollover flow manually                                          |
| M9  | Notifications          | Daily/limit/monthly reminders via the chosen library                                                   | Reminders fire at the configured times on a real device                                       |
| M10 | i18n + dark mode pass  | Full ar/en + light/dark across every screen already built                                              | Flip both toggles on every screen, check RTL mirroring                                        |

_M10's scope narrows once 8.4 lands: i18n infrastructure and onboarding's translations already exist — M10 becomes "translate every remaining screen + the dark-mode pass," not "build i18n from scratch."_
| M11 | Export/import | Real file share (JSON/CSV) and import-with-preview | Export, then re-import on a clean install |
| M12 | Polish + store assets | App icon, splash, screenshots, privacy policy page | Final review against the prototype, screen by screen |

**First prompt to give Cursor (Milestone 0):**

> Read `hasabaty-architecture.md` fully, especially Sections 1–2. Before writing any code, tell me your plan for Milestone 0 only: initializing the RN CLI project, installing the stack from Section 1, and creating the folder structure from Section 2 with empty placeholder files. Do not write app code yet — just scaffold and confirm the app boots to a blank screen. Wait for my go-ahead before starting Milestone 1.

---

## 6. Design tokens

Extracted directly from `hasabaty-prototype-v7.html`'s CSS custom properties — not re-interpreted. These are the exact values; `theme.ts` should contain these numbers verbatim, not approximations.

### 6.1 Colors — light mode

| Token        | Hex                     | Used for                                                      |
| ------------ | ----------------------- | ------------------------------------------------------------- |
| `nile`       | `#0B6B57`               | Primary brand — buttons, links, selected states               |
| `nileDark`   | `#084F41`               | Primary pressed state                                         |
| `nileLight`  | `#E3F0EB`               | Selected-row tint, positive badges                            |
| `gold`       | `#C89B3C`               | Accent — FAB, best-month highlight                            |
| `goldLight`  | `#F6ECD3`               | Gold badge background                                         |
| `goldText`   | `#8a6a1f`               | Text on gold-light backgrounds (never plain black — contrast) |
| `coral`      | `#D2472E`               | Expense amounts, destructive actions                          |
| `coralLight` | `#FBE7E2`               | Expense/danger badge background                               |
| `sand`       | `#F5F3EE`               | Page/screen background                                        |
| `sand2`      | `#FFFFFF`               | Card/surface background, input background                     |
| `ink`        | `#211E1A`               | Primary text                                                  |
| `ink2`       | `#75706A`               | Secondary/muted text                                          |
| `ink3`       | `#A8A39B`               | Hint/tertiary text                                            |
| `line`       | `#E7E2D8`               | Borders, dividers                                             |
| `glass`      | `rgba(255,255,255,.94)` | Translucent overlays (nav bar, floating pills)                |

### 6.2 Colors — dark mode

| Token        | Hex                    | Note                                                           |
| ------------ | ---------------------- | -------------------------------------------------------------- |
| `nile`       | `#1C9E80`              | Brightened for contrast on dark bg                             |
| `nileDark`   | `#127A63`              |                                                                |
| `nileLight`  | `rgba(28,158,128,.18)` | Translucent tint, not solid — keeps `ink` text readable on top |
| `gold`       | `#D9AE55`              | Brightened                                                     |
| `goldLight`  | `rgba(217,174,85,.16)` | Translucent                                                    |
| `goldText`   | `#F0D18C`              | Light gold — inverts from light mode's dark-brown for contrast |
| `coral`      | `#E4573C`              | Brightened                                                     |
| `coralLight` | `rgba(228,87,60,.16)`  | Translucent                                                    |
| `sand`       | `#16181B`              | Page background                                                |
| `sand2`      | `#1F2226`              | Card/surface background                                        |
| `ink`        | `#F1EEE7`              | Primary text                                                   |
| `ink2`       | `#9C978F`              | Secondary text                                                 |
| `ink3`       | `#6B675F`              | Hint text                                                      |
| `line`       | `#2C2F33`              | Borders                                                        |
| `glass`      | `rgba(24,26,29,.86)`   | Translucent overlays                                           |

**Rule ported from the prototype:** light/dark are never approximated per-component — every color a component uses must come from this token table, resolved through the active theme. If a new UI need arises that isn't covered here, stop and ask rather than picking a new hex value.

### 6.3 Typography

Font family: **Cairo** (Google Font — needs `.ttf` files added to `src/assets/fonts/` and linked natively; weights 300/400/500/600/700/800 all used).

| Style | Size | Weight |
| ----- | ---- | ------ |
| h1    | 22px | 700    |
| h2    | 18px | 700    |
| h3    | 15px | 600    |
| body  | 15px | 400    |
| muted | 13px | 400    |
| tiny  | 11px | 400    |

### 6.4 Spacing & radius

| Token          | Value                | Used for                                                                                                                      |
| -------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `radius`       | 18px                 | Cards, sheets (top corners)                                                                                                   |
| `radiusSm`     | 12px                 | Buttons, inputs, chips-container                                                                                              |
| Card padding   | 18px                 |                                                                                                                               |
| Button padding | 15px 18px            |                                                                                                                               |
| Input padding  | 13px 14px            |                                                                                                                               |
| Chip padding   | 9px 14px             |                                                                                                                               |
| `sheetRadius`  | 26px                 | Bottom-sheet top corners only — distinct from `radius`, caught during M1 cross-checking against the prototype's `.sheet` rule |
| `overlay`      | `rgba(20,20,18,.42)` | Sheet/modal backdrop — same in both themes, not a light/dark token                                                            |
| `ringSafe`     | `#FFFFFF`            | `SpendRing`'s inner ring, under 80% of limit — always white on the constant `nile` card, not theme-dependent                  |
| `ringWarn`     | `#F4C15A`            | `SpendRing`'s inner ring, 80–99% of limit                                                                                     |
| `ringDanger`   | `#FF6B57`            | `SpendRing`'s inner ring, 100%+ of limit                                                                                      |

### 6.5 Category colors (fixed — not theme-dependent, same in light/dark)

| Category        | Color     | Category           | Color     |
| --------------- | --------- | ------------------ | --------- |
| Electricity     | `#C89B3C` | Rent               | `#5B6B73` |
| Water           | `#3B8AD4` | Phone/Internet     | `#0B6B57` |
| Food            | `#D2472E` | Shopping           | `#D4527E` |
| Transport       | `#7C6FE0` | Health             | `#C23B3B` |
| Entertainment   | `#9455C9` | Other              | `#8A8880` |
| Salary (income) | `#0B6B57` | Freelance (income) | `#3B8AD4` |
| Gift (income)   | `#D4527E` | Other income       | `#8A8880` |

---

## 7. Design system components

Each maps to a validated pattern from the prototype's CSS — not a new interpretation. Build all of these first, verify them on a temporary gallery screen (every variant, both themes, both languages), _then_ start wiring real screens in later milestones.

| Component             | Variants / props                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Prototype reference                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `AppText`             | `variant`: h1\|h2\|h3\|body\|muted\|tiny; `color` (token name, defaults to `ink`); `weight` override                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `.h1`–`.tiny` classes, Section 6.3                                                                             |
| `AppButton`           | `variant`: primary\|ghost; `fullWidth` (default true); `disabled`; optional leading icon                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `.btn-primary` / `.btn-ghost`                                                                                  |
| `AppCard`             | just a themed surface: `sand2` bg, `line` border, `radius` corners, 18px padding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `.card`                                                                                                        |
| `AppInput`            | `type`: text\|number; optional `label` above; uses `sand2` bg (never hardcoded white — that was a real dark-mode bug we fixed in the prototype, don't reintroduce it)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `.input`, `.field label`                                                                                       |
| `AppDate`             | dedicated date/time picker (not a variant of `AppInput` — different interaction model: tap to open a native picker, not type-to-enter). `mode`: date\|time; `value`/`onChange`; optional `label` (same styling as `AppInput`'s); optional `minimumDate`/`maximumDate` pass-through — component itself knows nothing about budget cycles, the screen using it supplies the constraint. Backed by `@react-native-community/datetimepicker`. Outer field container matches `AppInput`'s visual styling; **Android** uses `display="default"` (self-contained system dialog); **iOS** uses `display="spinner"` revealed inline below the field with an `AppButton` ghost "Done" to collapse it — deliberately not `display="compact"`, since that native pill would break visual consistency with the rest of the design system | `.input` container styling + `.field label`, interaction is new (prototype used a plain `<input type="date">`) |
| `AppChip`             | `selected` boolean (nile bg + white text when true, `sand2`/`line` when false); optional leading color dot                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `.chip` / `.chip.selected`                                                                                     |
| `AppToggle`           | on/off boolean; animated knob; **must flip `translateX` direction under RTL**, exactly like the prototype's `html[dir="rtl"] .toggle.on .knob` rule                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `.toggle`                                                                                                      |
| `AppBadge`            | `tone`: gold\|coral\|nile — pairs each tone's `-Light` background with its matching `-Text`/solid color, never plain black text on a tint                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `.banner`, best-month badge                                                                                    |
| `AppIcon`             | wraps our hand-drawn icon set (home, history, chart, gear, plus, x, chevrons including chevUp, bell, wallet, globe, info, tag, sun, moon, edit, check, download, upload) as SVG components; `size` prop; color defaults to `currentColor`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | prototype's `ICO` object, `chevUp` added for the income/expense indicator (10.3)                               |
| `BottomSheet`         | slide-up panel, backdrop, rounded top corners (`radius`), drag handle; used for Add Transaction and Month Picker                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `.sheet` / `.backdrop`                                                                                         |
| `EmptyState`          | centered icon + title + subtitle                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `.empty`                                                                                                       |
| `AppSearchList`       | reusable row-list picker — needed for both the currency step (M4) and History's month picker (M6), so it's built once rather than twice. Props: `items: {id, label, sublabel?, meta?}[]`, `selectedId`, `onSelect(id)`, optional `searchable` (default true, filters on label/sublabel), optional `searchPlaceholder`. Each row: label + optional sublabel on the leading side, optional meta text (e.g. a currency symbol, or a month's total spend) on the trailing side, selected state highlighted. Search input only renders when `searchable` is true                                                                                                                                                                                                                                                                 | `.list-pick` / `.list-pick-item`, `.search-input`                                                              |
| `AppSegmentedControl` | two-option toggle — needed for Add Transaction's Expense/Income (M5) and Settings' Appearance (Light/Dark) and Language (EN/AR) rows (M8), same pattern reused 3 times, built once. Props: `options: [{value, label}, {value, label}]`, `value`, `onChange(value)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `.seg`                                                                                                         |

**First prompt to give Cursor (Milestone 1):**

> Read Sections 6–7 of `hasabaty-architecture.md`. Build `src/config/theme.ts` with the exact light/dark token values from Section 6 — no approximated colors. Then build the design-system components listed in Section 7 in `src/components/`, matching their prototype CSS references exactly (cross-check `hasabaty-prototype-v7.html` directly for anything ambiguous).
>
> Before writing code, also tell me specifically how you'll handle the Cairo font: where the `.ttf` files will come from (none have been added to `src/assets/fonts/` yet — it only has a `.gitkeep`), and the exact native linking steps for both iOS and Android. If you need me to source and drop in specific font-weight files first, say so explicitly rather than working around it.
>
> Add a temporary gallery screen (not part of Section 2's real navigation — just a throwaway screen to view every component/variant at once) so we can visually verify against the prototype before it gets deleted in a later milestone. Do not wire these into any real feature screen yet — that starts in M4 onward. Tell me your plan before writing code, same as M0.

---

## 8. Settings store & onboarding data

### 8.1 `settingsStore.ts` (Zustand + MMKV persist)

Scope for M4 — just what onboarding needs. Notification preferences get added when M9 builds them, not now.

| Field           | Type                             | Notes                                                                                                                                                                                                   |
| --------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `currency`      | `string \| null`                 | ISO code, e.g. `'EGP'`; `null` until onboarding sets it                                                                                                                                                 |
| `monthlyLimit`  | `number \| null`                 | **Integer minor-units, same convention as `transactions.amount`** — keeps every spend-vs-limit comparison in the app doing integer math, never mixing a float limit against integer transaction amounts |
| `cycleType`     | `'calendar' \| 'custom' \| null` |                                                                                                                                                                                                         |
| `cycleStartDay` | `number \| null`                 | 1–28, only meaningful when `cycleType === 'custom'`                                                                                                                                                     |
| `onboarded`     | `boolean`                        | default `false`                                                                                                                                                                                         |

### 8.2 Currency list (exact — from the prototype, do not re-derive)

`EGP` (ج.م), `USD` ($), `EUR` (€), `GBP` (£), `SAR` (ر.س), `AED` (د.إ), `KWD` (د.ك), `QAR` (ر.ق), `JOD` (د.أ), `CAD` ($), `AUD` ($), `TRY` (₺), `INR` (₹), `JPY` (¥), `CNY` (¥), `CHF` (Fr), `MAD` (د.م), `TND` (د.ت) — 18 currencies, `EGP` preselected as default.

### 8.3 Notification library — pulled forward from M9

Onboarding's last step requests OS notification permission, which needs a real library now rather than a stub. **`react-native-notify-kit`** — a maintained, New-Architecture-exclusive fork of Notifee, API-compatible with the original `@notifee/react-native` (which was officially archived by Invertase in April 2026 — do not use it, it's unmaintained). Confirm current compatibility with RN 0.86.2 before use, same diligence as every other dependency. Scope for M4 is permission-request only (`notifee.requestPermission()` — same method name, compatible API); actual scheduling (daily reminder, limit warnings, monthly report) stays M9's job — don't build ahead into it.

### 8.4 Language switcher in onboarding — partial pull-forward from M10

Onboarding is a first-impression, one-time flow — getting stuck in the wrong language here is worse than anywhere else in the app, so this earns a real switcher now rather than waiting for M10. Scope is deliberately narrow: **only the 4 onboarding screens get translated now.** The rest of the app (Home, History, Insights, Settings, etc.) stays hardcoded English until M10, when those screens exist in more final form — M10's job narrows to "translate everything else + the dark-mode pass," not "set up i18n infrastructure from scratch."

**What this pulls forward from Section 1's i18n row:** `i18next` + `react-i18next` + `react-native-localize` + `react-native-restart`, and the exact `I18nManager.forceRTL()` + restart mechanism already specified there — implemented for real now, not deferred.

**Switcher placement:** a small shared piece (not a full `AppComponent` — this is onboarding-flow-specific, same reasoning as why the step-progress dots aren't componentized either) rendered consistently across all 4 onboarding screens, similar to the prototype's original floating language pill (before it moved into Settings-only for the main app). Onboarding is a different context from the main app — a persistent quick-switch here is justified even though we deliberately removed it from the main app's chrome earlier.

**The one non-obvious requirement:** switching language mid-onboarding triggers `I18nManager.forceRTL()` + `RNRestart.restart()`, which reloads the entire JS bundle — meaning whatever onboarding step and entered values (currency selection, limit, etc.) exist only in React state will be lost unless persisted first. **Persist the current onboarding step and any already-entered values to MMKV _before_ triggering the restart**, and resume at that same step after reload — not back at Welcome. Losing progress on a language switch would be a real regression, not a cosmetic one.

**Pitfall found during testing:** resuming via a bare `initialRouteName` isn't enough — it starts the stack fresh at that screen with no history behind it, so the back button has nothing to pop to and React Navigation throws `GO_BACK was not handled`. Resuming at step N must reconstruct the _actual_ stack history (all steps 1 through N as real history entries, N focused on top), not just jump to step N in isolation.

**Translation scope for `en.json`/`ar.json` right now:** just the 4 onboarding screens' copy, plus any shared UI strings they use (e.g. `AppButton` labels like "Continue"/"Back" if those are hardcoded elsewhere and reused here).

---

**First prompt to give Cursor (Milestone 4):**

> Read Section 8 fully, plus the onboarding screen names already locked in Section 1 (`WelcomeScreen`, `CurrencyStepScreen`, `CycleAndLimitStepScreen`, `NotificationPermissionStepScreen`). Build `settingsStore.ts` per 8.1, wire the real onboarding flow using `AppText`/`AppButton`/`AppInput`/`AppChip` from the design system — no new UI patterns invented. Currency step uses the exact list in 8.2. Confirm `react-native-notify-kit`'s current compatibility with RN 0.86.2/new architecture before using it for the permission step per 8.3. On completion, set `onboarded: true` and navigate into the real tab navigator (replacing whatever `DebugDataScreen` is currently sitting on Home — this is also the moment to do that swap-back). Tell me your plan before writing code, same as every milestone.

---

## 9. Keyboard handling — resolve before M5

Not yet addressed anywhere in this doc, and M5 (`AddTransactionSheet`: amount, description, date, all inside a sheet) is about to be the most keyboard-heavy screen in the app. Fix this now, at the component level, not per-screen later.

**Highest-risk spot:** `BottomSheet` renders inside RN's `Modal` — a separate native surface, same category of problem we already hit with gesture-handler needing its own nested root inside the Modal. Keyboard-avoidance has a similar reputation for behaving inconsistently inside `Modal`. Don't assume it works; verify it explicitly, same rigor as the gesture-handler-in-Modal fix.

**Two real approaches to investigate, not one assumed:**

1. Native OS-level handling (`android:windowSoftInputMode="adjustResize"` in `AndroidManifest.xml` + RN's built-in `KeyboardAvoidingView` with platform-appropriate `behavior` — typically `'padding'` on iOS) — the traditional approach, but with known platform-inconsistency quirks.
2. `react-native-keyboard-controller` — more robust, Reanimated-powered keyboard handling with smoother cross-platform behavior. We already have `react-native-reanimated` installed from the `BottomSheet` migration, so this pairs naturally if it's compatible.

**Scope:** fix `BottomSheet` itself first (internal to the component, so `AddTransactionSheet` and any future sheet inherit it for free), then verify the same behavior is correct wherever `AppInput`/`AppDate` are used outside a sheet too — onboarding's `CycleAndLimitStepScreen` already has live number inputs built in M4 and should be checked, not assumed fine.

**Decision (locked):** `react-native-keyboard-controller` — chosen over native `KeyboardAvoidingView`/`adjustResize` specifically because Section 9's failure mode is Modal + multi-input sheet, and the library has documented, Modal-aware APIs (`automaticOffset`, `KeyboardAwareScrollView`) plus resolved Fabric/Modal focus-event issues, rather than inherited platform-inconsistency quirks. Verify with real screenshots on **both platforms independently** — don't let one platform's pass stand in for the other, this exact asymmetry has bitten us before (`AppDate`'s picker UI, `BottomSheet`'s gesture registration).

**First prompt to give Cursor:**

> Read Section 9. Investigate both keyboard-handling approaches for RN 0.86.2/new architecture, specifically how each behaves with inputs inside `BottomSheet`'s `Modal` — don't assume either works cleanly inside a Modal, verify it. Recommend one with reasoning, confirm compatibility if it's `react-native-keyboard-controller` (new dependency, needs approval same as everything else). Fix `BottomSheet` internally first, then check `CycleAndLimitStepScreen`'s existing inputs from M4 aren't already exhibiting a keyboard-covering-the-input bug. Show me an actual screenshot/recording of a text input inside an open `BottomSheet` with the keyboard up, not just a written claim it works. Tell me your plan before writing code.

---

## 10. Home + Add Transaction (Milestone 5)

### 10.1 Shared hooks

**`useCycleRange()`** — `src/hooks/useCycleRange.ts`. Reads `cycleType`/`cycleStartDay` from `settingsStore`, returns `{start: Date, end: Date}` for the _current_ cycle relative to now. Port the exact algorithm from the prototype's `getCycleRange()` function in `hasabaty-prototype-v7.html` — calendar type is 1st–last day of the month; custom type is this month's `cycleStartDay` (or last month's, if today's date is before that day) through the day before the next cycle starts. Don't re-derive this logic from scratch — the prototype's version is already correct and tested.

**`useCurrentCycleStats()`** — `src/features/home/hooks/useCurrentCycleStats.ts`. Uses `useCycleRange()` + `transactionsApi`'s existing date-range filter (M3 already built this — "optional date-range/category/type filters, for later milestones" from the M3 changelog, use it now rather than adding a new query path). Computes: `totalSpend`, `totalIncome`, `net` (income − spend), `limitPct` (spend ÷ `monthlyLimit`), `cyclePct` (time elapsed in cycle ÷ total cycle length).

### 10.2 Currency formatting

`src/lib/currencyUtils.ts` — `formatMoney(minorUnits: number, currencyCode: string): string`. Looks up the symbol from `currencies.ts` (M4), divides by 100, **whole numbers only, no decimal places** — matches the prototype's `fmt()` exactly (`Math.round(n).toLocaleString() + ' ' + symbol`). Don't add decimals the prototype never showed.

### 10.3 Home screen

**`SpendRing`** — the dual concentric-ring signature element from the prototype, via `react-native-svg` (already installed). Exact parameters, not approximated: inner ring radius 48 / stroke-width 7 (spend %, color white by default, `amber`/`coral` at the 80%/100% thresholds — same logic as the limit-warning thresholds decided back in Step 1); outer ring radius 38 / stroke-width 4 (cycle-elapsed %, always `gold`). Sits on a `nile`-colored card, matching `.ring-card`. Center text: spend amount (large) + "of [limit]" caption.

**`StatCards`** — Income + Net Balance, two-column, matching `.stat-grid`/`.stat-card`. Net's color follows the same positive/negative convention already used elsewhere (`nile` if ≥0, `coral` if negative).

**`RecentTransactionsList`** — last 5 transactions, sorted by date descending. Each row: a circle in the category's color (same container as before), showing a small `chevUp` (income) or `chevDown` (expense) icon in white — **not** the category's first letter. Color still carries category identity; the icon now adds direction, which a letter didn't convey. Don't invent per-category icons (food fork, electricity bolt, etc.) — `AppIcon`'s set stays UI-glyphs plus this one addition, not a category-icon library.

**Empty state:** `EmptyState` component when the current cycle has zero transactions — a genuinely new user should see this, not fabricated data (this was already correctly avoided during M4, same principle applies here).

**FAB:** opens `AddTransactionSheet` in add mode. Tapping a row in `RecentTransactionsList` opens the same sheet in edit mode (see 10.4).

### 10.4 `AddTransactionSheet`

One component, two modes — driven by an optional `editingTransaction` prop, not two separate screens (Section 2 corrected). Built on `BottomSheet`, inheriting the M5-prerequisite keyboard handling from Section 9 automatically.

| Field          | Behavior                                                                                                                                                                                       |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Type toggle    | `AppSegmentedControl` — Expense / Income, defaults to Expense (or the transaction's existing type, in edit mode)                                                                               |
| Amount         | `AmountInput` — large centered numeric field matching `.amount-input`/`.amount-wrap`, currency code shown below, no border (transparent bg, matching prototype)                                |
| Category       | `CategoryChips` — horizontal scroll of `AppChip`, filtered to the selected type's categories via `useCategories`, each chip shows its color dot + name                                         |
| Description    | `AppInput` text, optional, placeholder matching the prototype's "Add a note (optional)"                                                                                                        |
| Date           | `AppDate`, `mode="date"`, `minimumDate={cycleRange.start}`, `maximumDate={today}` — **this is the real wiring of the constraint `AppDate` was built for back in Section 7**, defaults to today |
| Repeat monthly | `AppToggle` + label, matching the prototype's repeat-monthly control                                                                                                                           |
| Save           | `AppButton` primary, disabled until amount > 0 and a category is selected; calls `useAddTransaction` (add mode) or `useUpdateTransaction` (edit mode)                                          |
| Delete         | edit mode only — `AppButton` ghost, `coral`-colored text, calls `useDeleteTransaction`, matching the prototype's delete styling                                                                |

**Hosting (decided):** a small, **non-persisted** Zustand store (`transactionSheetStore` — plain in-memory, no MMKV wrapper, unlike `settingsStore`) holding `open`, `editingTransaction`, `openAdd()`, `openEdit(tx)`, `close()`. `<AddTransactionSheet />` mounts once at app-shell level (next to the tabs in `RootNavigator`, or a thin `AppShell` wrapper) — `HomeScreen` and `History` (M6) just call the store's open functions, neither one "owns" the sheet. Chosen over a stack route specifically because `BottomSheet` already owns its own `Modal` presentation — reintroducing a stack route would mean re-fighting that same conflict for navigation benefits (deep-linking to a specific transaction) we don't actually need yet.

**First prompt to give Cursor (Milestone 5):**

> Read Section 10 fully, plus Sections 6–9 for the tokens/components/keyboard-handling this builds on. Build the shared hooks in 10.1, currency formatting in 10.2, then Home screen (10.3) and `AddTransactionSheet` (10.4) exactly as specified — this is a big milestone, so tell me your plan broken into clear sub-steps before writing any code, and check in after the data-layer wiring (hooks + `AddTransactionSheet` functional) before polishing Home's visuals, rather than building everything silently in one pass. Don't invent new category icons — the letter-avatar approach in 10.3 is correct prototype behavior, not a placeholder. Verify end-to-end: add a transaction, confirm it appears in Home's recent list and updates the ring/stats correctly, edit it, delete it — on both platforms, with real screenshots.

---

## 11. History (Milestone 6)

### 11.1 New hooks

- **`useAvailableMonths()`** — `src/features/history/hooks/`. Returns sorted month keys (`YYYY-MM`) that have at least one transaction — port the prototype's `availableMonths()` logic.
- **`useMonthStats(monthKey)`** — spend/income totals for a _specific calendar month_, not cycle-based. **This carries forward a deliberate simplification decided back in the HTML prototype phase: History and Insights bucket by calendar month regardless of the user's chosen cycle type** (calendar vs. custom start day) — only Home's _current_ cycle respects the custom start day. Don't apply cycle boundaries to historical months; that was a conscious scope decision, not an oversight.
- **`useMonthTransactions(monthKey)`** — transactions within that calendar month, grouped by date for the list.

### 11.2 History screen

- Header: month label (tap opens the month picker) + prev/next arrows, disabled at the boundaries of `useAvailableMonths()`'s list.
- Stats: reuse `StatCards` for the viewed month's spend/income.
- List: grouped by date with date headers; rows reuse the exact same visual as `RecentTransactionsList` (category-colored circle + `chevUp`/`chevDown`) — same component if practical, not a re-implementation. Tapping a row opens edit via `transactionSheetStore.openEdit()` — this is exactly what that shared store was built for, should be a trivial call here.
- `EmptyState` if the viewed month has zero transactions.

### 11.3 Month picker sheet

- **Local state within the History screen** — not `transactionSheetStore`. Only History ever opens this; there's no cross-screen reuse need the way `AddTransactionSheet` had, so a shared global store would be overkill here.
- Reuses `AppSearchList`'s row-rendering/selection pattern, but needs **year-grouping (section headers)**, which `AppSearchList`'s flat `items` prop doesn't natively support (Currency in M4 didn't need this). Investigate the cleanest way to add it — extending `AppSearchList` with optional grouping, or composing multiple sections around it — and tell me which before implementing, same as the Currency-search-vs-chips question in M4.
- `searchable={false}` — few enough months that search doesn't add value here, unlike an 18-item currency list.
- "Jump to current month" quick action at the top.
- **Defer the "Best" badge to M7.** It depends on Insights' best-month metric toggle (lowest spend vs. highest savings), which doesn't exist yet — don't build a badge with no real metric behind it yet.

**First prompt to give Cursor (Milestone 6):**

> Read Section 11 fully, plus Section 10 for the components/patterns this reuses (`StatCards`, the transaction row visual, `transactionSheetStore`, `AppSearchList`). Build the hooks in 11.1, then History (11.2) and the month picker (11.3). Tell me your plan — specifically how you'd add year-grouping to `AppSearchList` or compose around it — before writing code. Verify with real data across several months (the seeded/test data should span enough months to exercise month navigation and the picker properly), on both platforms, with screenshots.
