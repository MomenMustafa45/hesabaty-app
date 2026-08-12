import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  reevaluateDailyReminderAfterMutation,
  runLimitWarningAfterAdd,
} from '@lib/limitWarningFromMutation';
import { NewTransactionInput } from '@models/transaction';
import { addTransaction } from '../api/transactionsApi';
import { transactionsQueryKeys } from '../api/transactionsQueryKeys';

export function useAddTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewTransactionInput) => addTransaction(input),
    onSuccess: async (_transaction, input) => {
      await queryClient.invalidateQueries({
        queryKey: transactionsQueryKeys.lists(),
      });
      await runLimitWarningAfterAdd(input);
      await reevaluateDailyReminderAfterMutation();
    },
  });
}
