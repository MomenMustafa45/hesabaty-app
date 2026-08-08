import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { getTheme, Theme, ThemeMode } from '@config/theme';

const ThemeContext = createContext<Theme | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Overrides the resolved system theme — used by the temporary gallery screen only. */
  modeOverride?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, modeOverride }) => {
  const systemScheme = useColorScheme();
  const mode: ThemeMode = modeOverride ?? (systemScheme === 'dark' ? 'dark' : 'light');
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
