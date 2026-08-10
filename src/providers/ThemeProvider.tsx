import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { getTheme, Theme, ThemeMode } from '@config/theme';
import { useSettingsStore } from '@store/settingsStore';

const ThemeContext = createContext<Theme | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemScheme = useColorScheme();
  const themeOverride = useSettingsStore(state => state.themeOverride);
  const mode: ThemeMode =
    themeOverride ?? (systemScheme === 'dark' ? 'dark' : 'light');
  const theme = useMemo(() => getTheme(mode), [mode]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
}

export default ThemeProvider;
