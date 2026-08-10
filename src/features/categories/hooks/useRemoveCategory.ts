import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeCategory } from '../api/categoriesApi';
import { categoriesQueryKeys } from '../api/categoriesQueryKeys';

export function useRemoveCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeCategory(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: categoriesQueryKeys.list(),
      });
    },
  });
}
