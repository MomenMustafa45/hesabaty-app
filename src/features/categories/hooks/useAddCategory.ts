import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TransactionType } from '@models/transaction';
import { addCategory } from '../api/categoriesApi';
import { categoriesQueryKeys } from '../api/categoriesQueryKeys';

export function useAddCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { type: TransactionType; label: string }) =>
      addCategory(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: categoriesQueryKeys.list(),
      });
    },
  });
}
