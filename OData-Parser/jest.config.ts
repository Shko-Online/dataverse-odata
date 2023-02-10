import { JestConfigWithTsJest } from 'ts-jest';

export default {
  testMatch: [' **/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageReporters: ['cobertura', 'text', 'html']
} as JestConfigWithTsJest;
