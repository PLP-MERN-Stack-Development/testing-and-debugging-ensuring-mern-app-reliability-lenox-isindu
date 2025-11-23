const request = require('supertest');
const createTestApp = require('../test-app');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');

// Mock models
jest.mock('../../src/models/User');
jest.mock('../../src/models/Workspace');
jest.mock('../../src/models/Bug');

describe('Bug Tracking End-to-End Tests', () => {
  let app, authToken;

  beforeAll(() => {
    authToken = jwt.sign({ id: 'user123' }, process.env.JWT_SECRET);
  });

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
    
    // Mock User.findById for protect middleware
    User.findById.mockResolvedValue({
      _id: 'user123',
      username: 'testuser',
      email: 'test@example.com'
    });
  });

  describe('Bug Tracking Basics', () => {
    it('should verify bug tracking endpoints are accessible', async () => {
      //  a simple test that just verifies the endpoint exists
     
      const response = await request(app)
        .get('/api/bugs')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Workspace ID is required');
    });

  });
});