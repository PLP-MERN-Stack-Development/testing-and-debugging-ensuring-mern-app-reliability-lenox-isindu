module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],  
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',  
    '!src/models/**/*.js'
  ],
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'], 
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'  
  }
};