import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import AppButton from '@components/AppButton';
import AppDate from '@components/AppDate';
import AppInput from '@components/AppInput';
import AppIcon from '@components/AppIcon';
import AppSegmentedControl from '@components/AppSegmentedControl';
import AppText from '@components/AppText';
import BottomSheet from '@components/BottomSheet';
import { useCategories } from '@features/categories/hooks/useCategories';
import { useCycleRange } from '@hooks/useCycleRange';
import { useCurrency } from '@hooks/useCurrency';
import { majorToMinor, minorToMajor } from '@lib/currencyUtils';
import { parseIsoDate, startOfLocalDay, toIsoDate } from '@lib/dateUtils';
import { Transaction, TransactionType } from '@models/transaction';
import { useTheme } from '@providers/ThemeProvider';
import { useRolloverStore } from '@store/rolloverStore';
import { TransactionSheetPrefill } from '@store/transactionSheetStore';
import { AmountInput } from '../../components/AmountInput';
import { CategoryChips } from '../../components/CategoryChips';
import { RepeatToggle } from '../../components/RepeatToggle';
import { useAddTransaction } from '../../hooks/useAddTransaction';
import { useDeleteTransaction } from '../../hooks/useDeleteTransaction';
import { useUpdateTransaction } from '../../hooks/useUpdateTransaction';
import { createStyles } from './AddTransactionSheet.styles';

export interface AddTransactionSheetProps {
  visible: boolean;
  onClose: () => void;
  editingTransaction?: Transaction | null;
  prefill?: TransactionSheetPrefill | null;
}

const TYPE_OPTIONS: [
  { value: TransactionType; label: string },
  { value: TransactionType; label: string },
] = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
];

function amountToInputValue(minorUnits: number): string {
  const major = minorToMajor(minorUnits);
  return Number.isInteger(major) ? String(major) : String(major);
}

export const AddTransactionSheet: React.FC<AddTransactionSheetProps> = ({
  visible,
  onClose,
  editingTransaction = null,
  prefill = null,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { currencyCode } = useCurrency();
  const { start: cycleStart } = useCycleRange();
  const todayIso = toIsoDate(new Date());
  const today = useMemo(() => parseIsoDate(todayIso), [todayIso]);
  const { data: categories = [] } = useCategories();
  const addMutation = useAddTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();
  const dismissPendingKey = useRolloverStore(state => state.dismissPendingKey);

  const isEditing = editingTransaction != null;

  const [type, setType] = useState<TransactionType>('expense');
  const [amountText, setAmountText] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => startOfLocalDay());
  const [recurring, setRecurring] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmountText(amountToInputValue(editingTransaction.amount));
      setCategoryId(editingTransaction.categoryId);
      setDescription(editingTransaction.description ?? '');
      setDate(parseIsoDate(editingTransaction.date));
      setRecurring(editingTransaction.recurring);
      return;
    }

    if (prefill) {
      setType(prefill.type);
      setAmountText(amountToInputValue(prefill.amount));
      setCategoryId(prefill.categoryId);
      setDescription(prefill.description ?? '');
      setDate(today);
      setRecurring(prefill.recurring);
      return;
    }

    setType('expense');
    setAmountText('');
    setCategoryId(null);
    setDescription('');
    setDate(today);
    setRecurring(false);
  }, [visible, editingTransaction, prefill, today]);

  const parsedMajor = useMemo(() => {
    const parsed = Number.parseFloat(amountText.replace(',', '.'));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return 0;
    }
    return parsed;
  }, [amountText]);

  const canSave = parsedMajor > 0 && categoryId != null;
  const isBusy =
    addMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const handleTypeChange = (nextType: TransactionType) => {
    setType(nextType);
    setCategoryId(null);
  };

  const handleSave = async () => {
    if (!canSave || categoryId == null) {
      return;
    }

    const payload = {
      type,
      categoryId,
      amount: majorToMinor(parsedMajor),
      description: description.trim() ? description.trim() : null,
      date: toIsoDate(date),
      recurring,
    };

    if (editingTransaction) {
      await updateMutation.mutateAsync({
        id: editingTransaction.id,
        ...payload,
      });
    } else {
      await addMutation.mutateAsync(payload);
      if (prefill?.rolloverKey) {
        dismissPendingKey(prefill.rolloverKey);
      }
    }
    onClose();
  };

  const handleDelete = async () => {
    if (!editingTransaction) {
      return;
    }
    await deleteMutation.mutateAsync(editingTransaction.id);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.head}>
        <View style={styles.headSpacer} />
        <AppText variant="h3">{isEditing ? 'Edit transaction' : 'Add transaction'}</AppText>
        <Pressable
          style={styles.closeBtn}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close">
          <AppIcon name="x" size={15} color={theme.colors.ink2} />
        </Pressable>
      </View>

      <AppSegmentedControl
        options={TYPE_OPTIONS}
        value={type}
        onChange={handleTypeChange}
      />

      <AmountInput
        value={amountText}
        onChangeText={setAmountText}
        currencyCode={currencyCode}
      />

      <View style={styles.field}>
        <AppText variant="muted" weight={600} style={styles.fieldLabel}>
          Category
        </AppText>
        <CategoryChips
          categories={categories}
          type={type}
          selectedId={categoryId}
          onSelect={setCategoryId}
        />
      </View>

      <View style={styles.field}>
        <AppInput
          label="Description"
          placeholder="Add a note (optional)"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View style={styles.field}>
        <AppDate
          label="Date"
          mode="date"
          value={date}
          onChange={setDate}
          minimumDate={cycleStart}
          maximumDate={today}
        />
      </View>

      <RepeatToggle value={recurring} onValueChange={setRecurring} />

      <View style={styles.actions}>
        {isEditing ? (
          <AppButton
            variant="ghost"
            fullWidth={false}
            style={[styles.actionFlex, styles.deleteGhost]}
            labelColor="coral"
            disabled={isBusy}
            onPress={handleDelete}>
            Delete
          </AppButton>
        ) : null}
        <AppButton
          fullWidth={!isEditing}
          style={isEditing ? styles.actionFlex : undefined}
          disabled={!canSave || isBusy}
          onPress={handleSave}>
          Save
        </AppButton>
      </View>
    </BottomSheet>
  );
};

export default AddTransactionSheet;
