require('dotenv').config();
process.env.NODE_ENV = 'test';

// Increase timeout for E2E tests
jest.setTimeout(30000);