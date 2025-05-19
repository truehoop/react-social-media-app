const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@base': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@helpers': path.resolve(__dirname, 'src/helpers'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@base/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@helpers/(.*)$': '<rootDir>/src/helpers/$1',
        '^@pages/(.*)$': '<rootDir>/src/pages/$1',
        '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
        '^@types/(.*)$': '<rootDir>/src/types/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
      },
    },
  },
};
