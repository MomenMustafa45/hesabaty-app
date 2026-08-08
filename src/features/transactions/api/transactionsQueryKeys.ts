import { TransactionsFilter } from '@models/transaction';

export const transactionsQueryKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionsQueryKeys.all, 'list'] as const,
  list: (filter: TransactionsFilter = {}) =>
    [...transactionsQueryKeys.lists(), filter] as const,
  detail: (id: string) => [...transactionsQueryKeys.all, 'detail', id] as const,
};
