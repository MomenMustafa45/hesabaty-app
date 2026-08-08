import React from 'react';
import AddTransactionSheet from '@features/transactions/screens/AddTransactionSheet';
import { useTransactionSheetStore } from '@store/transactionSheetStore';

/** Single app-shell mount so Home/History share one sheet instance. */
export const TransactionSheetHost: React.FC = () => {
  const isOpen = useTransactionSheetStore(state => state.isOpen);
  const editingTransaction = useTransactionSheetStore(
    state => state.editingTransaction,
  );
  const close = useTransactionSheetStore(state => state.close);

  return (
    <AddTransactionSheet
      visible={isOpen}
      onClose={close}
      editingTransaction={editingTransaction}
    />
  );
};

export default TransactionSheetHost;
