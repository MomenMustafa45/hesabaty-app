import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '@providers/ThemeProvider';
import { ColorTokens, FontWeightToken, TextVariant } from '@config/theme';
import { createStyles } from './AppText.styles';

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: keyof ColorTokens;
  weight?: FontWeightToken;
  children?: React.ReactNode;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color,
  weight,
  style,
  children,
  ...rest
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const variantStyle = theme.typography[variant];
  const resolvedColor = theme.colors[color ?? variantStyle.color];
  const resolvedWeight = weight ?? variantStyle.fontWeight;

  return (
    <Text
      style={[
        styles.base,
        {
          fontSize: variantStyle.fontSize,
          // fontWeight is intentionally omitted — each weight is its own font family,
          // so setting fontWeight would trigger OS-synthesized faux-bold on top of it.
          fontFamily: theme.fontFamilyByWeight[resolvedWeight],
          color: resolvedColor,
        },
        style,
      ]}
      {...rest}>
      {children}
    </Text>
  );
};

export default AppText;
