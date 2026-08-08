module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@navigations/(.*)$': '<rootDir>/src/navigations/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@models/(.*)$': '<rootDir>/src/types/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@providers/(.*)$': '<rootDir>/src/providers/$1',
    '^@storage/(.*)$': '<rootDir>/src/storage/$1',
    '^@locales/(.*)$': '<rootDir>/src/locales/$1',
  },
};
