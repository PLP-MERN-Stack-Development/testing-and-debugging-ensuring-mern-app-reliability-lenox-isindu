const request = require('supertest');
const createTestApp = require('../test-app');
const User = require('../../src/models/User');
const Workspace = require('../../src/models/Workspace');
const jwt = require('jsonwebtoken');

// Mock models
jest.mock('../../src/models/User');
jest.mock('../../src/models/Workspace');

describe('Workspace Management End-to-End Tests', () => {
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
      email: 'test@example.com',
      workspaces: []
    });
  });

  describe('Workspace Operations', () => {
    it('should get user workspaces', async () => {
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        workspaces: [
          {
            workspaceId: {
              _id: 'workspace123',
              name: 'Test Workspace',
              members: [{ userId: { _id: 'user123', username: 'testuser' } }]
            },
            role: 'admin'
          }
        ]
      };

      User.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser)
      });

      const response = await request(app)
        .get('/api/workspaces')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockUser.workspaces);
    });

   
  });
});