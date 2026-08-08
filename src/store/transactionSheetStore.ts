import { create } from 'zustand';
import { Transaction } from '@models/transaction';

interface TransactionSheetState {
  isOpen: boolean;
  editingTransaction: Transaction | null;
  openAdd: () => void;
  openEdit: (transaction: Transaction) => void;
  close: () => void;
}

/** In-memory only — must not persist (stale sheet on cold start). */
export const useTransactionSheetStore = create<TransactionSheetState>(set => ({
  isOpen: false,
  editingTransaction: null,
  openAdd: () => set({ isOpen: true, editingTransaction: null }),
  openEdit: transaction =>
    set({ isOpen: true, editingTransaction: transaction }),
  close: () => set({ isOpen: false, editingTransaction: null }),
}));
