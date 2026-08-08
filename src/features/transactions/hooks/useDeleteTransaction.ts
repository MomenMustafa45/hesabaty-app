import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTransaction } from '../api/transactionsApi';
import { transactionsQueryKeys } from '../api/transactionsQueryKeys';

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: async (_result, id) => {
      await queryClient.invalidateQueries({
        queryKey: transactionsQueryKeys.lists(),
      });
      await queryClient.invalidateQueries({
        queryKey: transactionsQueryKeys.detail(id),
      });
    },
  });
}
