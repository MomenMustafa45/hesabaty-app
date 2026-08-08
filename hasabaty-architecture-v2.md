# حساباتي — Technical Architecture

**Status:** Step 2 in progress. This document is the single source of truth for the React Native build — hand it to Cursor alongside the HTML prototype. It grows section by section as decisions get locked; nothing here should contradict the prototype's validated design and behavior.

---

## 1. Foundational stack (locked)

| Concern           | Choice                                                                                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework         | React Native CLI (bare, no Expo), new architecture                                                                                                                              |
| Language          | TypeScript                                                                                                                                                                      |
| Package manager   | bun                                                                                                                                                                             |
| Local database    | `@op-engineering/op-sqlite`                                                                                                                                                     |
| Key-value storage | MMKV (settings, preferences — mirrors the reference project's pattern)                                                                                                          |
| Client state      | Zustand (settings/app state)                                                                                                                                                    |
| Async data layer  | React Query — wraps local SQLite reads/writes too, not just network calls, giving loading/refetch semantics for free even with no backend                                       |
| Navigation        | React Navigation — native bottom tabs via `createNativeBottomTabNavigator` from `@react-navigation/bottom-tabs/unstable`                                                        |
| i18n              | i18next + react-i18next + react-native-localize; RTL handled via `I18nManager` + full app restart on language change (native RTL cannot flip live like the HTML prototype does) |
| Theming           | `ThemeProvider` resolving light/dark from system `Appearance` + MMKV-persisted override                                                                                         |
| Notifications     | TBD — sub-step 8                                                                                                                                                                |
| App identity      | Internal/technical name `Hasabaty`; on-device display name `حساباتي`; bundle ID / application ID `com.hasabaty.app` (iOS + Android)                                             |

**Known risk flagged for Cursor:** the native bottom tabs API is genuinely unstable as the name says — as of now there's an open Android bug where returning from a screen outside the tab navigator can blank out tab content, and an iOS label-positioning glitch on first render. Test the "tab → screen outside tabs → back" flow early, not at the end. Tab bar icons must be image assets (native constraint) — everywhere else in the app, our hand-drawn SVG icon set carries over directly.

---

## 2. Folder structure

Feature-first, matching the reference project's conventions exactly — no new patterns invented.

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
  components/            AppText, AppButton, AppCard, AppInput, AppChip, AppToggle, AppBadge,
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
`@components`, `@features`, `@navigations`, `@lib`, `@config`, `@types`, `@assets`, `@hooks`, `@store`, `@providers`, `@storage`, `@locales`.

Same rule applies as the reference doc states: `babel.config.js`, `tsconfig.json` (`paths`), and `jest.config.js` (`moduleNameMapper`) must all stay in sync whenever this list changes.

## 4. Data model (preview — finalized in the data-layer sub-step)

Two SQLite tables, not stored in MMKV, since they're relational and user-editable:

- **`transactions`** — id, type, category_id, amount, description, date, recurring, created_at, updated_at
- **`categories`** — id, type, label_en, label_ar, color, is_default, sort_order (seeded with our default set on first run)

Settings (currency, monthly limit, cycle type/start day, onboarded flag, notification prefs, theme/language preference) live in Zustand + MMKV, not SQLite — they're single-row config, not relational data.

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
