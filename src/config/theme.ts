export type ThemeMode = 'light' | 'dark';

export interface ColorTokens {
  nile: string;
  nileDark: string;
  nileLight: string;
  gold: string;
  goldLight: string;
  goldText: string;
  coral: string;
  coralLight: string;
  sand: string;
  sand2: string;
  ink: string;
  ink2: string;
  ink3: string;
  line: string;
  glass: string;
  white: string;
  black: string;
}

const lightColors: ColorTokens = {
  nile: '#0B6B57',
  nileDark: '#084F41',
  nileLight: '#E3F0EB',
  gold: '#C89B3C',
  goldLight: '#F6ECD3',
  goldText: '#8a6a1f',
  coral: '#D2472E',
  coralLight: '#FBE7E2',
  sand: '#F5F3EE',
  sand2: '#FFFFFF',
  ink: '#211E1A',
  ink2: '#75706A',
  ink3: '#A8A39B',
  line: '#E7E2D8',
  glass: 'rgba(255,255,255,.94)',
  white: '#FFFFFF',
  black: '#000000',
};

const darkColors: ColorTokens = {
  nile: '#1C9E80',
  nileDark: '#127A63',
  nileLight: 'rgba(28,158,128,.18)',
  gold: '#D9AE55',
  goldLight: 'rgba(217,174,85,.16)',
  goldText: '#F0D18C',
  coral: '#E4573C',
  coralLight: 'rgba(228,87,60,.16)',
  sand: '#16181B',
  sand2: '#1F2226',
  ink: '#F1EEE7',
  ink2: '#9C978F',
  ink3: '#6B675F',
  line: '#2C2F33',
  glass: 'rgba(24,26,29,.86)',
  white: '#000000',
  black: '#FFFFFF',
};

export const colorsByMode: Record<ThemeMode, ColorTokens> = {
  light: lightColors,
  dark: darkColors,
};

export type FontWeightToken = 300 | 400 | 500 | 600 | 700 | 800;

export const fontFamilyByWeight: Record<FontWeightToken, string> = {
  300: 'Cairo-Light',
  400: 'Cairo-Regular',
  500: 'Cairo-Medium',
  600: 'Cairo-SemiBold',
  700: 'Cairo-Bold',
  800: 'Cairo-ExtraBold',
};

export type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'muted' | 'tiny';

export interface TypographyStyle {
  fontSize: number;
  fontWeight: FontWeightToken;
  fontFamily: string;
  color: keyof ColorTokens;
}

export const typography: Record<TextVariant, TypographyStyle> = {
  h1: {
    fontSize: 22,
    fontWeight: 700,
    fontFamily: fontFamilyByWeight[700],
    color: 'ink',
  },
  h2: {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: fontFamilyByWeight[700],
    color: 'ink',
  },
  h3: {
    fontSize: 15,
    fontWeight: 600,
    fontFamily: fontFamilyByWeight[600],
    color: 'ink',
  },
  body: {
    fontSize: 15,
    fontWeight: 400,
    fontFamily: fontFamilyByWeight[400],
    color: 'ink',
  },
  muted: {
    fontSize: 13,
    fontWeight: 400,
    fontFamily: fontFamilyByWeight[400],
    color: 'ink2',
  },
  tiny: {
    fontSize: 11,
    fontWeight: 400,
    fontFamily: fontFamilyByWeight[400],
    color: 'ink3',
  },
};

export const radii = {
  radius: 18,
  radiusSm: 12,
  sheetRadius: 26,
  pill: 999,
};

export const spacing = {
  cardPadding: 18,
  buttonPaddingVertical: 15,
  buttonPaddingHorizontal: 18,
  inputPaddingVertical: 13,
  inputPaddingHorizontal: 14,
  chipPaddingVertical: 9,
  chipPaddingHorizontal: 14,
};

export const overlay = 'rgba(20,20,18,.42)';

/** SpendRing inner-ring strokes — same in light/dark (always on nile card). */
export const ringColors = {
  ringSafe: '#FFFFFF',
  ringWarn: '#F4C15A',
  ringDanger: '#FF6B57',
} as const;

export type CategoryColorKey =
  | 'electricity'
  | 'water'
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'rent'
  | 'phoneInternet'
  | 'shopping'
  | 'health'
  | 'other'
  | 'salary'
  | 'freelance'
  | 'gift'
  | 'otherIncome';

export const categoryColors: Record<CategoryColorKey, string> = {
  electricity: '#C89B3C',
  water: '#3B8AD4',
  food: '#D2472E',
  transport: '#7C6FE0',
  entertainment: '#9455C9',
  rent: '#5B6B73',
  phoneInternet: '#0B6B57',
  shopping: '#D4527E',
  health: '#C23B3B',
  other: '#8A8880',
  salary: '#0B6B57',
  freelance: '#3B8AD4',
  gift: '#D4527E',
  otherIncome: '#8A8880',
};

export interface Theme {
  mode: ThemeMode;
  colors: ColorTokens;
  typography: typeof typography;
  fontFamilyByWeight: typeof fontFamilyByWeight;
  radii: typeof radii;
  spacing: typeof spacing;
  overlay: string;
  ringColors: typeof ringColors;
  categoryColors: typeof categoryColors;
}

export function getTheme(mode: ThemeMode): Theme {
  return {
    mode,
    colors: colorsByMode[mode],
    typography,
    fontFamilyByWeight,
    radii,
    spacing,
    overlay,
    ringColors,
    categoryColors,
  };
}
