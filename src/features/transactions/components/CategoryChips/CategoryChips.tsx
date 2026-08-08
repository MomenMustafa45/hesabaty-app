import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import AppChip from '@components/AppChip';
import { Category } from '@models/category';
import { TransactionType } from '@models/transaction';
import { useSettingsStore } from '@store/settingsStore';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './CategoryChips.styles';

export interface CategoryChipsProps {
  categories: Category[];
  type: TransactionType;
  selectedId: string | null;
  onSelect: (categoryId: string) => void;
}

function categoryLabel(category: Category, language: string): string {
  return language === 'ar' ? category.labelAr : category.labelEn;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  type,
  selectedId,
  onSelect,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const language = useSettingsStore(state => state.language);

  const filtered = useMemo(
    () => categories.filter(category => category.type === type),
    [categories, type],
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      keyboardShouldPersistTaps="handled">
      {filtered.map(category => (
        <AppChip
          key={category.id}
          selected={category.id === selectedId}
          dotColor={category.color}
          onPress={() => onSelect(category.id)}>
          {categoryLabel(category, language)}
        </AppChip>
      ))}
    </ScrollView>
  );
};

export default CategoryChips;
