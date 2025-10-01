/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['package.json'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};

module.exports = config;