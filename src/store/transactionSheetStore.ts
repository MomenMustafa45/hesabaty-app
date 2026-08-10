import { create } from 'zustand';
import { Transaction, TransactionType } from '@models/transaction';

/** Prefill for add-mode (rollover Edit) — not an existing row to update. */
export interface TransactionSheetPrefill {
  type: TransactionType;
  categoryId: string;
  amount: number;
  description: string | null;
  recurring: boolean;
  /** Pending-recurring key to dismiss after a successful save. */
  rolloverKey?: string;
}

interface TransactionSheetState {
  isOpen: boolean;
  editingTransaction: Transaction | null;
  prefill: TransactionSheetPrefill | null;
  openAdd: () => void;
  openEdit: (transaction: Transaction) => void;
  openPrefill: (prefill: TransactionSheetPrefill) => void;
  close: () => void;
}

/** In-memory only — must not persist (stale sheet on cold start). */
export const useTransactionSheetStore = create<TransactionSheetState>(set => ({
  isOpen: false,
  editingTransaction: null,
  prefill: null,
  openAdd: () =>
    set({ isOpen: true, editingTransaction: null, prefill: null }),
  openEdit: transaction =>
    set({ isOpen: true, editingTransaction: transaction, prefill: null }),
  openPrefill: prefill =>
    set({ isOpen: true, editingTransaction: null, prefill }),
  close: () =>
    set({ isOpen: false, editingTransaction: null, prefill: null }),
}));
