import { create } from 'zustand';

interface RolloverState {
  /** Dev/QA force-open — does not imply a real cycle boundary. */
  manualPreview: boolean;
  /** Session-only keys (`type:categoryId`) confirmed or edited away. */
  dismissedKeys: string[];
  openManualPreview: () => void;
  closeManualPreview: () => void;
  dismissPendingKey: (key: string) => void;
  resetSession: () => void;
}

/** In-memory only — matches the prototype's `state.rollover.dismissed`. */
export const useRolloverStore = create<RolloverState>(set => ({
  manualPreview: false,
  dismissedKeys: [],
  openManualPreview: () => set({ manualPreview: true, dismissedKeys: [] }),
  closeManualPreview: () => set({ manualPreview: false }),
  dismissPendingKey: key =>
    set(state =>
      state.dismissedKeys.includes(key)
        ? state
        : { dismissedKeys: [...state.dismissedKeys, key] },
    ),
  resetSession: () => set({ manualPreview: false, dismissedKeys: [] }),
}));
