import React, { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import DateTimePicker, {
  DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import { localeForLanguage } from '@lib/dateUtils';
import { localizationKeys } from '@locales/localizationKeys';
import { useSettingsStore } from '@store/settingsStore';
import { useTheme } from '@providers/ThemeProvider';
import AppButton from '../AppButton';
import AppText from '../AppText';
import { createStyles } from './AppDate.styles';

export type AppDateMode = 'date' | 'time';

export interface AppDateProps {
  value: Date;
  onChange: (date: Date) => void;
  mode: AppDateMode;
  label?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

function formatValue(
  value: Date,
  mode: AppDateMode,
  locale: string,
): string {
  if (mode === 'date') {
    return value.toLocaleDateString(locale);
  }
  return value.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const AppDate: React.FC<AppDateProps> = ({
  value,
  onChange,
  mode,
  label,
  minimumDate,
  maximumDate,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const language = useSettingsStore(state => state.language);
  const locale = localeForLanguage(language);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [draftValue, setDraftValue] = useState(value);

  const handlePress = () => {
    setDraftValue(value);
    setIsPickerOpen(true);
  };

  const handleAndroidValueChange = (
    _event: DateTimePickerChangeEvent,
    selectedDate: Date,
  ) => {
    setIsPickerOpen(false);
    onChange(selectedDate);
  };

  const handleAndroidDismiss = () => {
    setIsPickerOpen(false);
  };

  const handleIosValueChange = (
    _event: DateTimePickerChangeEvent,
    selectedDate: Date,
  ) => {
    setDraftValue(selectedDate);
  };

  const handleDone = () => {
    onChange(draftValue);
    setIsPickerOpen(false);
  };

  const handleCancel = () => {
    setIsPickerOpen(false);
  };

  return (
    <View style={styles.container}>
      {label ? (
        <AppText variant="tiny" weight={600} color="ink2" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <Pressable
        style={[styles.field, isPickerOpen && styles.fieldOpen]}
        onPress={handlePress}
      >
        <AppText variant="body">
          {formatValue(value, mode, locale)}
        </AppText>
      </Pressable>
      {isPickerOpen && Platform.OS === 'android' ? (
        <DateTimePicker
          value={value}
          mode={mode}
          display="default"
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onValueChange={handleAndroidValueChange}
          onDismiss={handleAndroidDismiss}
        />
      ) : null}
      {isPickerOpen && Platform.OS === 'ios' ? (
        <View style={styles.iosPickerContainer}>
          <DateTimePicker
            value={draftValue}
            mode={mode}
            display="spinner"
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onValueChange={handleIosValueChange}
          />
          <View style={styles.iosPickerActions}>
            <AppButton
              variant="ghost"
              fullWidth={false}
              style={styles.iosPickerButton}
              onPress={handleCancel}
            >
              {t(localizationKeys.cancel)}
            </AppButton>
            <AppButton
              variant="primary"
              fullWidth={false}
              style={styles.iosPickerButton}
              onPress={handleDone}
            >
              {t(localizationKeys.done)}
            </AppButton>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default AppDate;
