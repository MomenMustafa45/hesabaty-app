import type { InitialState } from '@react-navigation/native';
import { DEFAULT_CURRENCY_CODE } from '@config/currencies';
import { OnboardingDraft } from '@models/settings';
import { OnboardingStackParamList } from './types';

type OnboardingRoute =
  | { name: 'Welcome' }
  | { name: 'CurrencyStep' }
  | { name: 'CycleAndLimitStep'; params: OnboardingStackParamList['CycleAndLimitStep'] }
  | {
      name: 'NotificationPermissionStep';
      params: OnboardingStackParamList['NotificationPermissionStep'];
    };

const majorUnitsToMinorUnits = (value: string): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 600000;
  }
  return Math.round(parsed * 100);
};

/**
 * Builds a stack state with history for steps 1..N (N focused), so Back can
 * pop after language-switch / cold-start resume. A bare initialRouteName only
 * mounts N and leaves GO_BACK unhandled.
 */
export function buildOnboardingStackInitialState(
  draft: OnboardingDraft | null,
): InitialState {
  const step = draft?.step ?? 'Welcome';
  const currency = draft?.currency ?? DEFAULT_CURRENCY_CODE;
  const routes: OnboardingRoute[] = [{ name: 'Welcome' }];

  if (step === 'Welcome') {
    return { index: 0, routes };
  }

  routes.push({ name: 'CurrencyStep' });
  if (step === 'CurrencyStep') {
    return { index: 1, routes };
  }

  routes.push({
    name: 'CycleAndLimitStep',
    params: { currency },
  });
  if (step === 'CycleAndLimitStep') {
    return { index: 2, routes };
  }

  routes.push({
    name: 'NotificationPermissionStep',
    params: {
      currency,
      monthlyLimit: majorUnitsToMinorUnits(draft?.draftLimitMajor ?? '6000'),
      cycleType: draft?.cycleType ?? 'calendar',
      cycleStartDay: draft?.cycleStartDay ?? null,
    },
  });
  return { index: 3, routes };
}

/** Root NavigationContainer initial state when still in onboarding. */
export function buildRootOnboardingInitialState(
  draft: OnboardingDraft | null,
): InitialState {
  return {
    routes: [
      {
        name: 'Onboarding',
        state: buildOnboardingStackInitialState(draft),
      },
    ],
  };
}
