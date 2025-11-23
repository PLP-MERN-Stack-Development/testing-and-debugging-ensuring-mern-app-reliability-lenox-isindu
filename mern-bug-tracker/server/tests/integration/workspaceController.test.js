const request = require('supertest');
const createTestApp = require('../test-app');
const Workspace = require('../../src/models/Workspace');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');

// Mock models
jest.mock('../../src/models/Workspace');
jest.mock('../../src/models/User');

describe('Workspace Controller - Integration Tests', () => {
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

  describe('GET /api/workspaces', () => {
    it('should get user workspaces successfully', async () => {
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        workspaces: [
          {
            workspaceId: {
              _id: 'workspace123',
              name: 'Test Workspace',
              description: 'Test workspace description',
              code: 'TEST123',
              createdBy: 'user123',
              members: [
                { 
                  userId: { 
                    _id: 'user123', 
                    username: 'testuser', 
                    email: 'test@example.com' 
                  },
                  role: 'admin'
                }
              ]
            },
            role: 'admin'
          }
        ]
      };

      // Mock User.findById with populate chain
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

    it('should return empty array if user has no workspaces', async () => {
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        workspaces: []
      };

      // Mock User.findById with populate chain
      User.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser)
      });

      const response = await request(app)
        .get('/api/workspaces')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });
  });


});