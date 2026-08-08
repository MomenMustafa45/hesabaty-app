import { useQuery } from '@tanstack/react-query';
import { TransactionsFilter } from '@models/transaction';
import { getTransactions } from '../api/transactionsApi';
import { transactionsQueryKeys } from '../api/transactionsQueryKeys';

export function useTransactions(filter: TransactionsFilter = {}) {
  return useQuery({
    queryKey: transactionsQueryKeys.list(filter),
    queryFn: () => getTransactions(filter),
  });
}
