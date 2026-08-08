export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  type: TransactionType;
  categoryId: string;
  /** Minor units (piastres). 50.00 EGP = 5000. */
  amount: number;
  description: string | null;
  /** ISO date `YYYY-MM-DD`. */
  date: string;
  recurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewTransactionInput {
  type: TransactionType;
  categoryId: string;
  amount: number;
  description?: string | null;
  date: string;
  recurring?: boolean;
}

export interface UpdateTransactionInput {
  id: string;
  type?: TransactionType;
  categoryId?: string;
  amount?: number;
  description?: string | null;
  date?: string;
  recurring?: boolean;
}

export interface TransactionsFilter {
  type?: TransactionType;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
}
