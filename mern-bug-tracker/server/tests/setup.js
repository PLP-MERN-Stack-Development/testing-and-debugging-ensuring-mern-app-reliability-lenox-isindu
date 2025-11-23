require('dotenv').config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_for_testing_only';

// Global test timeout
jest.setTimeout(30000);

// Global mocks
global.console = {
  ...console,
  // uncomment to silence log messages during tests
  // log: jest.fn(),
  // error: jest.fn(),
  // warn: jest.fn(),
};