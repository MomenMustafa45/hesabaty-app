import React from 'react';
import { Modal } from 'react-native';
import { useCycleRolloverCheck } from '@features/rollover/hooks/useCycleRolloverCheck';
import NewMonthScreen from '@features/rollover/screens/NewMonthScreen';

/** App-shell host — mirrors TransactionSheetHost placement. */
export const RolloverHost: React.FC = () => {
  const { isVisible, dismiss } = useCycleRolloverCheck();

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={dismiss}>
      <NewMonthScreen onDismiss={dismiss} />
    </Modal>
  );
};

export default RolloverHost;
