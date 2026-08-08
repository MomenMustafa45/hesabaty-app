import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/categoriesApi';
import { categoriesQueryKeys } from '../api/categoriesQueryKeys';

export function useCategories() {
  return useQuery({
    queryKey: categoriesQueryKeys.list(),
    queryFn: getCategories,
  });
}
