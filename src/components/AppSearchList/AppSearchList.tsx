import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import AppText from '@components/AppText';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './AppSearchList.styles';

export interface AppSearchListItem {
  id: string;
  label: string;
  sublabel?: string;
  meta?: string;
}

export interface AppSearchListSection {
  title: string;
  items: AppSearchListItem[];
}

type AppSearchListBaseProps = {
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
};

export type AppSearchListProps = AppSearchListBaseProps &
  (
    | { items: AppSearchListItem[]; sections?: never }
    | { sections: AppSearchListSection[]; items?: never }
  );

function matchesQuery(item: AppSearchListItem, normalized: string): boolean {
  if (!normalized) {
    return true;
  }
  const labelMatch = item.label.toLowerCase().includes(normalized);
  const sublabelMatch = item.sublabel?.toLowerCase().includes(normalized);
  return labelMatch || Boolean(sublabelMatch);
}

export const AppSearchList: React.FC<AppSearchListProps> = props => {
  const {
    selectedId,
    onSelect,
    searchable = true,
    searchPlaceholder = 'Search',
  } = props;
  const theme = useTheme();
  const styles = createStyles(theme);
  const [query, setQuery] = useState('');

  const normalized = searchable ? query.trim().toLowerCase() : '';

  const filteredItems = useMemo(() => {
    if (!('items' in props) || !props.items) {
      return [];
    }
    if (!searchable || !normalized) {
      return props.items;
    }
    return props.items.filter(item => matchesQuery(item, normalized));
  }, [props, normalized, searchable]);

  const filteredSections = useMemo(() => {
    if (!('sections' in props) || !props.sections) {
      return [];
    }
    if (!searchable || !normalized) {
      return props.sections;
    }
    return props.sections
      .map(section => ({
        ...section,
        items: section.items.filter(item => matchesQuery(item, normalized)),
      }))
      .filter(section => section.items.length > 0);
  }, [props, normalized, searchable]);

  const renderRow = (item: AppSearchListItem, isLast: boolean) => {
    const isSelected = item.id === selectedId;
    return (
      <Pressable
        key={item.id}
        onPress={() => onSelect(item.id)}
        style={({ pressed }) => [
          styles.row,
          isLast && styles.rowLast,
          isSelected && styles.rowSelected,
          pressed && !isSelected && styles.rowPressed,
        ]}>
        <View style={styles.rowLeading}>
          <AppText variant="h3" color={isSelected ? 'nile' : 'ink'}>
            {item.label}
          </AppText>
          {item.sublabel ? (
            <AppText variant="tiny">{item.sublabel}</AppText>
          ) : null}
        </View>
        {item.meta ? <AppText variant="muted">{item.meta}</AppText> : null}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {searchable ? (
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder={searchPlaceholder}
          placeholderTextColor={theme.colors.ink3}
          autoCorrect={false}
          autoCapitalize="none"
        />
      ) : null}

      {'sections' in props && props.sections ? (
        <View style={styles.sections}>
          {filteredSections.map(section => (
            <View key={section.title} style={styles.section}>
              <AppText variant="tiny" weight={700} style={styles.sectionTitle}>
                {section.title}
              </AppText>
              <View style={styles.list}>
                {section.items.map((item, index) =>
                  renderRow(item, index === section.items.length - 1),
                )}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          style={[styles.list, styles.listConstrained]}
          data={filteredItems}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item, index }) =>
            renderRow(item, index === filteredItems.length - 1)
          }
        />
      )}
    </View>
  );
};

export default AppSearchList;
