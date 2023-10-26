module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['./src/services/service/alert/alert.service.ts'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      statements: 100,
    },
  },
  coveragePathIgnorePatterns: ['node_modules', 'dist', 'index.ts'],
  testPathIgnorePatterns: ['node_modules', 'dist'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^test/(.*)$': '<rootDir>/test/$1',
  },
  setupFiles: ['./jest.setup.js', 'dotenv/config'],
};
