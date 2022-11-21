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
  moduleFileExtensions: ['cjs','ejs','js', 'ts'],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  transform: {
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        babelConfig: false,
        diagnostics: false,
        tsconfig: './tsconfig.json'
      }
    ],
  },
  transformIgnorePatterns: ['node_modules/'],
  verbose: false,
};
