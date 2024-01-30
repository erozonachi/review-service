// eslint-disable-next-line node/no-unpublished-require, import/no-extraneous-dependencies
const { defaults: tsJestPreset } = require('ts-jest/presets');

module.exports = {
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,js}'],
  collectCoverage: false,
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        ...tsJestPreset,
        tsconfig: '<rootDir>/test/tsconfig.json',
        isolatedModules: true,
        diagnostics: false,
      },
    ],
  },
  preset: '@shelf/jest-mongodb',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  watchPathIgnorePatterns: ['globalConfig'],
};
