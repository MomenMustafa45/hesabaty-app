import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  reevaluateDailyReminderAfterMutation,
  runLimitWarningAfterUpdate,
} from '@lib/limitWarningFromMutation';
import { UpdateTransactionInput } from '@models/transaction';
import { getTransactionById, updateTransaction } from '../api/transactionsApi';
import { transactionsQueryKeys } from '../api/transactionsQueryKeys';

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateTransactionInput) => {
      const previous = await getTransactionById(input.id);
      if (!previous) {
        throw new Error(`Transaction not found: ${input.id}`);
      }
      const next = await updateTransaction(input);
      return { previous, next };
    },
    onSuccess: async ({ previous, next }) => {
      await queryClient.invalidateQueries({
        queryKey: transactionsQueryKeys.lists(),
      });
      await queryClient.invalidateQueries({
        queryKey: transactionsQueryKeys.detail(next.id),
      });
      await runLimitWarningAfterUpdate(previous, next);
      await reevaluateDailyReminderAfterMutation();
    },
  });
}
