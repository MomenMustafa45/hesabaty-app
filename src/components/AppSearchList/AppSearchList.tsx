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

export interface AppSearchListProps {
  items: AppSearchListItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
}

export const AppSearchList: React.FC<AppSearchListProps> = ({
  items,
  selectedId,
  onSelect,
  searchable = true,
  searchPlaceholder = 'Search',
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchable) {
      return items;
    }
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return items;
    }
    return items.filter(item => {
      const labelMatch = item.label.toLowerCase().includes(normalized);
      const sublabelMatch = item.sublabel?.toLowerCase().includes(normalized);
      return labelMatch || Boolean(sublabelMatch);
    });
  }, [items, query, searchable]);

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
      <FlatList
        style={styles.list}
        data={filteredItems}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item, index }) => {
          const isSelected = item.id === selectedId;
          const isLast = index === filteredItems.length - 1;
          return (
            <Pressable
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
              {item.meta ? (
                <AppText variant="muted">{item.meta}</AppText>
              ) : null}
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default AppSearchList;
