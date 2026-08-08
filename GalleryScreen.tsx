/**
 * Temporary Milestone 1 gallery screen.
 *
 * Shows every design-system component/variant at once so it can be checked
 * against hasabaty-prototype-v7.html by eye, in both light and dark theme.
 * Not part of Section 2's real navigation — delete once M1 is verified.
 */
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import AppBadge from '@components/AppBadge';
import AppButton from '@components/AppButton';
import AppCard from '@components/AppCard';
import AppChip from '@components/AppChip';
import AppDate from '@components/AppDate';
import AppIcon, { AppIconName } from '@components/AppIcon';
import AppInput from '@components/AppInput';
import AppText from '@components/AppText';
import AppToggle from '@components/AppToggle';
import BottomSheet from '@components/BottomSheet';
import EmptyState from '@components/EmptyState';
import { categoryColors, Theme, ThemeMode } from '@config/theme';
import { ThemeProvider, useTheme } from '@providers/ThemeProvider';
import { createStyles } from './GalleryScreen.styles';
import { SafeAreaView } from 'react-native-safe-area-context';

const ALL_ICON_NAMES: AppIconName[] = [
  'home',
  'history',
  'chart',
  'gear',
  'plus',
  'x',
  'chevronLeft',
  'chevronRight',
  'chevronForward',
  'chevronDown',
  'bell',
  'wallet',
  'globe',
  'info',
  'tag',
  'sun',
  'moon',
  'edit',
  'check',
  'download',
  'upload',
];

interface SectionProps {
  label: string;
  styles: ReturnType<typeof createStyles>;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ label, styles, children }) => (
  <View style={styles.section}>
    <AppText variant="h2" style={styles.sectionLabel}>
      {label}
    </AppText>
    {children}
  </View>
);

const GalleryContent: React.FC<{
  mode: ThemeMode;
  onToggleMode: () => void;
}> = ({ mode, onToggleMode }) => {
  const theme: Theme = useTheme();
  const styles = createStyles(theme);
  const [selectedChip, setSelectedChip] = useState('food');
  const [isToggleOn, setIsToggleOn] = useState(true);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [dateValue, setDateValue] = useState(new Date());
  const [timeValue, setTimeValue] = useState(new Date());

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <AppText variant="h1">Design system gallery</AppText>
          <AppButton
            variant="ghost"
            fullWidth={false}
            style={styles.themeToggleButton}
            onPress={onToggleMode}
            leadingIcon={
              <AppIcon name={mode === 'light' ? 'moon' : 'sun'} size={16} />
            }
          >
            {mode === 'light' ? 'Dark' : 'Light'}
          </AppButton>
        </View>

        <View style={styles.rtlNote}>
          <AppText variant="muted" color="goldText">
            RTL is not live-toggleable this milestone — it requires
            I18nManager.forceRTL + app restart (M10). Verify mirroring manually
            by setting the simulator language to Arabic and relaunching.
          </AppText>
        </View>

        <Section label="Typography" styles={styles}>
          <View style={styles.column}>
            <AppText variant="h1">h1 — Aa 22/700</AppText>
            <AppText variant="h2">h2 — Aa 18/700</AppText>
            <AppText variant="h3">h3 — Aa 15/600</AppText>
            <AppText variant="body">body — Aa 15/400</AppText>
            <AppText variant="muted">muted — Aa 13/400</AppText>
            <AppText variant="tiny">tiny — Aa 11/400</AppText>
          </View>
        </Section>

        <Section label="Buttons" styles={styles}>
          <View style={styles.column}>
            <AppButton variant="primary">Primary button</AppButton>
            <AppButton variant="ghost">Ghost button</AppButton>
            <AppButton variant="primary" disabled>
              Disabled primary
            </AppButton>
            <AppButton
              variant="primary"
              leadingIcon={<AppIcon name="plus" size={16} color="#fff" />}
            >
              With leading icon
            </AppButton>
          </View>
        </Section>

        <Section label="Card" styles={styles}>
          <AppCard>
            <AppText variant="h3">Card title</AppText>
            <AppText variant="muted">
              sand2 background, line border, 18px radius/padding.
            </AppText>
          </AppCard>
        </Section>

        <Section label="Inputs" styles={styles}>
          <View style={styles.column}>
            <AppInput label="Text" type="text" placeholder="Description" />
            <AppInput
              label="Number"
              type="number"
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </Section>

        <Section label="Date & time" styles={styles}>
          <View style={styles.column}>
            <AppDate label="Date" mode="date" value={dateValue} onChange={setDateValue} />
            <AppDate label="Time" mode="time" value={timeValue} onChange={setTimeValue} />
          </View>
        </Section>

        <Section label="Chips" styles={styles}>
          <View style={styles.row}>
            {(['food', 'transport', 'entertainment', 'other'] as const).map(
              category => (
                <AppChip
                  key={category}
                  selected={selectedChip === category}
                  dotColor={categoryColors[category]}
                  onPress={() => setSelectedChip(category)}
                >
                  {category}
                </AppChip>
              ),
            )}
          </View>
        </Section>

        <Section label="Toggle" styles={styles}>
          <View style={styles.toggleRow}>
            <AppText variant="body">Daily reminder</AppText>
            <AppToggle value={isToggleOn} onValueChange={setIsToggleOn} />
          </View>
        </Section>

        <Section label="Badges" styles={styles}>
          <View style={styles.row}>
            <AppBadge tone="gold">★ Best month</AppBadge>
            <AppBadge tone="coral">Over limit</AppBadge>
            <AppBadge tone="nile">On track</AppBadge>
          </View>
        </Section>

        <Section label="Icons" styles={styles}>
          <View style={styles.iconGrid}>
            {ALL_ICON_NAMES.map(name => (
              <View key={name} style={styles.iconGridItem}>
                <View style={styles.iconGridMark}>
                  <AppIcon name={name} size={20} />
                </View>
                <AppText variant="tiny">{name}</AppText>
              </View>
            ))}
          </View>
        </Section>

        <Section label="Bottom sheet" styles={styles}>
          <AppButton variant="ghost" onPress={() => setIsSheetVisible(true)}>
            Open bottom sheet
          </AppButton>
        </Section>

        <Section label="Empty state" styles={styles}>
          <AppCard>
            <EmptyState
              icon="wallet"
              title="No transactions yet"
              subtitle="Add your first expense or income to get started."
            />
          </AppCard>
        </Section>
      </ScrollView>

      <BottomSheet
        visible={isSheetVisible}
        onClose={() => setIsSheetVisible(false)}
      >
        <View style={styles.sheetContent}>
          <AppText variant="h3">Bottom sheet</AppText>
          <AppText variant="muted">
            26px top radius, drag the handle down or tap the backdrop to
            dismiss.
          </AppText>
          <AppButton variant="primary" onPress={() => setIsSheetVisible(false)}>
            Close
          </AppButton>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export const GalleryScreen: React.FC = () => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const handleToggleMode = () =>
    setMode(current => (current === 'light' ? 'dark' : 'light'));

  return (
    <ThemeProvider modeOverride={mode}>
      <GalleryContent mode={mode} onToggleMode={handleToggleMode} />
    </ThemeProvider>
  );
};

export default GalleryScreen;
