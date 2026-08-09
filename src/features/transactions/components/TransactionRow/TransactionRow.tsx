import React from 'react';
import { Pressable, View } from 'react-native';
import AppIcon from '@components/AppIcon';
import AppText from '@components/AppText';
import { useCurrency } from '@hooks/useCurrency';
import { Transaction } from '@models/transaction';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './TransactionRow.styles';

export interface TransactionRowProps {
  transaction: Transaction;
  categoryLabel: string;
  categoryColor: string;
  subline: string;
  isLast?: boolean;
  onPress: () => void;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  categoryLabel,
  categoryColor,
  subline,
  isLast = false,
  onPress,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { formatMoney } = useCurrency();
  const sign = transaction.type === 'expense' ? '−' : '+';
  const directionIcon = transaction.type === 'income' ? 'chevUp' : 'chevDown';

  return (
    <Pressable
      style={[styles.row, isLast && styles.rowLast]}
      onPress={onPress}>
      <View style={[styles.catDot, { backgroundColor: categoryColor }]}>
        <AppIcon
          name={directionIcon}
          size={16}
          color={theme.ringColors.ringSafe}
        />
      </View>
      <View style={styles.mid}>
        <AppText weight={600} numberOfLines={1}>
          {categoryLabel}
          {transaction.recurring ? ' ↻' : ''}
        </AppText>
        <AppText variant="tiny" numberOfLines={1}>
          {subline}
        </AppText>
      </View>
      <AppText
        weight={700}
        color={transaction.type === 'expense' ? 'coral' : 'nile'}>
        {sign}
        {formatMoney(transaction.amount)}
      </AppText>
    </Pressable>
  );
};

export default TransactionRow;
