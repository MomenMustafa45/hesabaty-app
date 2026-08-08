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
      screens/           AddTransactionSheet, EditTransactionSheet
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
  types/                 transaction.ts, category.ts, settings.ts
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

The reference project's existing alias set already covers حساباتي one-for-one — no new aliases needed:
`@components`, `@features`, `@navigations`, `@lib`, `@config`, `@models` (maps to `src/types/` — renamed from `@types` because TypeScript reserves `@types/*` for DefinitelyTyped packages), `@assets`, `@hooks`, `@store`, `@providers`, `@storage`, `@locales`.

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
| M11 | Export/import          | Real file share (JSON/CSV) and import-with-preview                                                     | Export, then re-import on a clean install                                                     |
| M12 | Polish + store assets  | App icon, splash, screenshots, privacy policy page                                                     | Final review against the prototype, screen by screen                                          |

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

| Component     | Variants / props                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Prototype reference                                                                                            |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `AppText`     | `variant`: h1\|h2\|h3\|body\|muted\|tiny; `color` (token name, defaults to `ink`); `weight` override                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `.h1`–`.tiny` classes, Section 6.3                                                                             |
| `AppButton`   | `variant`: primary\|ghost; `fullWidth` (default true); `disabled`; optional leading icon                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `.btn-primary` / `.btn-ghost`                                                                                  |
| `AppCard`     | just a themed surface: `sand2` bg, `line` border, `radius` corners, 18px padding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `.card`                                                                                                        |
| `AppInput`    | `type`: text\|number; optional `label` above; uses `sand2` bg (never hardcoded white — that was a real dark-mode bug we fixed in the prototype, don't reintroduce it)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `.input`, `.field label`                                                                                       |
| `AppDate`     | dedicated date/time picker (not a variant of `AppInput` — different interaction model: tap to open a native picker, not type-to-enter). `mode`: date\|time; `value`/`onChange`; optional `label` (same styling as `AppInput`'s); optional `minimumDate`/`maximumDate` pass-through — component itself knows nothing about budget cycles, the screen using it supplies the constraint. Backed by `@react-native-community/datetimepicker`. Outer field container matches `AppInput`'s visual styling; **Android** uses `display="default"` (self-contained system dialog); **iOS** uses `display="spinner"` revealed inline below the field with an `AppButton` ghost "Done" to collapse it — deliberately not `display="compact"`, since that native pill would break visual consistency with the rest of the design system | `.input` container styling + `.field label`, interaction is new (prototype used a plain `<input type="date">`) |
| `AppChip`     | `selected` boolean (nile bg + white text when true, `sand2`/`line` when false); optional leading color dot                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `.chip` / `.chip.selected`                                                                                     |
| `AppToggle`   | on/off boolean; animated knob; **must flip `translateX` direction under RTL**, exactly like the prototype's `html[dir="rtl"] .toggle.on .knob` rule                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `.toggle`                                                                                                      |
| `AppBadge`    | `tone`: gold\|coral\|nile — pairs each tone's `-Light` background with its matching `-Text`/solid color, never plain black text on a tint                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `.banner`, best-month badge                                                                                    |
| `AppIcon`     | wraps our hand-drawn icon set (home, history, chart, gear, plus, x, chevrons, bell, wallet, globe, info, tag, sun, moon, edit, check, download, upload) as SVG components; `size` prop; color defaults to `currentColor`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | prototype's `ICO` object                                                                                       |
| `BottomSheet` | slide-up panel, backdrop, rounded top corners (`radius`), drag handle; used for Add Transaction and Month Picker                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `.sheet` / `.backdrop`                                                                                         |
| `EmptyState`  | centered icon + title + subtitle                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `.empty`                                                                                                       |

**First prompt to give Cursor (Milestone 1):**

> Read Sections 6–7 of `hasabaty-architecture.md`. Build `src/config/theme.ts` with the exact light/dark token values from Section 6 — no approximated colors. Then build the design-system components listed in Section 7 in `src/components/`, matching their prototype CSS references exactly (cross-check `hasabaty-prototype-v7.html` directly for anything ambiguous).
>
> Before writing code, also tell me specifically how you'll handle the Cairo font: where the `.ttf` files will come from (none have been added to `src/assets/fonts/` yet — it only has a `.gitkeep`), and the exact native linking steps for both iOS and Android. If you need me to source and drop in specific font-weight files first, say so explicitly rather than working around it.
>
> Add a temporary gallery screen (not part of Section 2's real navigation — just a throwaway screen to view every component/variant at once) so we can visually verify against the prototype before it gets deleted in a later milestone. Do not wire these into any real feature screen yet — that starts in M4 onward. Tell me your plan before writing code, same as M0.
