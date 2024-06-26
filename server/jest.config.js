module.exports = {
  collectCoverageFrom: ['src/**/*.{ts}', '!**/*.d.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  transform: {
    '^.+\\.(j|t)s$': [
      'ts-jest',
      {
        babelConfig: false,
        diagnostics: false,
        tsconfig: './tsconfig.json',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/'],
  verbose: false,
};
