/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: { "^.+\\.tsx?$": ["ts-jest", {"rootDir": "."}] },
  testMatch: ["<rootDir>/__tests__/e2e/*.ts"]
};
/*
module.exports = {
  preset: '@shelf/jest-mongodb',
  transform: { "^.+\\.tsx?$": ["ts-jest", {"rootDir": "."}] }
};*/
