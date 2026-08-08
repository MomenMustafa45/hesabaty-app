module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './src/components',
          '@features': './src/features',
          '@navigations': './src/navigations',
          '@lib': './src/lib',
          '@config': './src/config',
          '@models': './src/types',
          '@assets': './src/assets',
          '@hooks': './src/hooks',
          '@store': './src/store',
          '@providers': './src/providers',
          '@storage': './src/storage',
          '@locales': './src/locales',
        },
      },
    ],
    // Must stay last — react-native-worklets/plugin requirement.
    'react-native-worklets/plugin',
  ],
};
