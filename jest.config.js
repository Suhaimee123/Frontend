module.exports = {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
      '^axios$': require.resolve('axios'),
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  };
  