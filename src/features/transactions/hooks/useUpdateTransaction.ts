import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateTransactionInput } from '@models/transaction';
import { updateTransaction } from '../api/transactionsApi';
import { transactionsQueryKeys } from '../api/transactionsQueryKeys';

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTransactionInput) => updateTransaction(input),
    onSuccess: async (transaction) => {
      await queryClient.invalidateQueries({
        queryKey: transactionsQueryKeys.lists(),
      });
      await queryClient.invalidateQueries({
        queryKey: transactionsQueryKeys.detail(transaction.id),
      });
    },
  });
}
