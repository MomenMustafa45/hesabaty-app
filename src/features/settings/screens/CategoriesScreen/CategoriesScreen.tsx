import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '@components/AppButton';
import AppIcon from '@components/AppIcon';
import AppInput from '@components/AppInput';
import AppText from '@components/AppText';
import { PROTECTED_CATEGORY_IDS } from '@features/categories/api/categoriesApi';
import { useAddCategory } from '@features/categories/hooks/useAddCategory';
import { useCategories } from '@features/categories/hooks/useCategories';
import { useRemoveCategory } from '@features/categories/hooks/useRemoveCategory';
import { SettingsSubHeader } from '@features/settings/components/SettingsSubHeader';
import { Category } from '@models/category';
import { TransactionType } from '@models/transaction';
import { SettingsStackParamList } from '@navigations/types';
import { useTheme } from '@providers/ThemeProvider';
import { useSettingsStore } from '@store/settingsStore';
import { createStyles } from './CategoriesScreen.styles';

type Navigation = NativeStackNavigationProp<SettingsStackParamList, 'Categories'>;

interface CategoryTypeSectionProps {
  title: string;
  type: TransactionType;
  categories: Category[];
  language: 'en' | 'ar';
  onRemove: (id: string) => void;
}

const CategoryTypeSection: React.FC<CategoryTypeSectionProps> = ({
  title,
  type,
  categories,
  language,
  onRemove,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { mutate: addCategory, isPending } = useAddCategory();
  const [label, setLabel] = useState('');

  const handleAdd = () => {
    const trimmed = label.trim();
    if (!trimmed) {
      return;
    }
    addCategory(
      { type, label: trimmed },
      { onSuccess: () => setLabel('') },
    );
  };

  return (
    <View style={styles.section}>
      <AppText variant="h3" style={styles.sectionTitle}>
        {title}
      </AppText>
      <View style={styles.card}>
        {categories.map((category, index) => {
          const isProtected = PROTECTED_CATEGORY_IDS.includes(category.id);
          const isLastRow = index === categories.length - 1;
          return (
            <View
              key={category.id}
              style={[styles.row, !isLastRow && styles.rowDivider]}>
              <View style={styles.rowLeading}>
                <View style={[styles.swatch, { backgroundColor: category.color }]} />
                <AppText variant="body">
                  {language === 'ar' ? category.labelAr : category.labelEn}
                </AppText>
              </View>
              {isProtected ? null : (
                <Pressable
                  style={styles.removeBtn}
                  onPress={() => onRemove(category.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${category.labelEn}`}>
                  <AppIcon name="x" size={12} color={theme.colors.ink2} />
                </Pressable>
              )}
            </View>
          );
        })}
      </View>
      <View style={styles.addRow}>
        <AppInput
          containerStyle={styles.addInput}
          placeholder="New category name"
          value={label}
          onChangeText={setLabel}
        />
        <AppButton
          variant="primary"
          fullWidth={false}
          disabled={isPending || !label.trim()}
          style={styles.addButton}
          onPress={handleAdd}>
          Add
        </AppButton>
      </View>
    </View>
  );
};

export const CategoriesScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<Navigation>();
  const language = useSettingsStore(state => state.language);
  const { data: categories = [] } = useCategories();
  const { mutate: removeCategory } = useRemoveCategory();

  const expenseCategories = categories.filter(category => category.type === 'expense');
  const incomeCategories = categories.filter(category => category.type === 'income');

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <SettingsSubHeader
          title="Manage categories"
          onBack={() => navigation.goBack()}
        />
        <CategoryTypeSection
          title="Expense"
          type="expense"
          categories={expenseCategories}
          language={language}
          onRemove={removeCategory}
        />
        <CategoryTypeSection
          title="Income"
          type="income"
          categories={incomeCategories}
          language={language}
          onRemove={removeCategory}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoriesScreen;
