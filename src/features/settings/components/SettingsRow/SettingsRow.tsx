import React from 'react';
import { I18nManager, Pressable, View } from 'react-native';
import AppIcon, { AppIconName } from '@components/AppIcon';
import AppText from '@components/AppText';
import { useTheme } from '@providers/ThemeProvider';
import { createStyles } from './SettingsRow.styles';
import { useSettingsStore } from '@store/settingsStore';

export interface SettingsRowProps {
  icon: AppIconName;
  label: string;
  /** Navigable row — renders a meta value + trailing chevron. */
  onPress?: () => void;
  meta?: string;
  /** Custom trailing content (e.g. AppSegmentedControl) — replaces the chevron. */
  trailing?: React.ReactNode;
  isLast?: boolean;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  label,
  onPress,
  meta,
  trailing,
  isLast = false,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { language } = useSettingsStore();
  const forwardIcon = language === 'ar' ? 'chevronLeft' : 'chevronForward';

  const content = (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      <View style={styles.leading}>
        <View style={styles.iconWrap}>
          <AppIcon name={icon} size={17} color={theme.colors.ink} />
        </View>
        <AppText variant="body">{label}</AppText>
      </View>
      {trailing ? (
        trailing
      ) : (
        <View style={styles.trailing}>
          {meta ? (
            <AppText variant="tiny" color="ink2">
              {meta}
            </AppText>
          ) : null}
          {onPress ? (
            <AppIcon name={forwardIcon} size={16} color={theme.colors.ink3} />
          ) : null}
        </View>
      )}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {content}
    </Pressable>
  );
};

export default SettingsRow;
