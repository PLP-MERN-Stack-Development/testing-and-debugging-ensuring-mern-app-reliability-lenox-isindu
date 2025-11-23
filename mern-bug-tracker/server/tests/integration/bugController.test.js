const request = require('supertest');
const createTestApp = require('../test-app');
const Bug = require('../../src/models/Bug');
const Workspace = require('../../src/models/Workspace');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');

// Mock models
jest.mock('../../src/models/Bug');
jest.mock('../../src/models/Workspace');
jest.mock('../../src/models/User');

describe('Bug Controller - Integration Tests', () => {
  let app, authToken;

  beforeAll(() => {
    authToken = jwt.sign({ id: 'user123' }, process.env.JWT_SECRET);
  });

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
    
    // Mock User.findById for the protect middleware
    User.findById.mockResolvedValue({
      _id: 'user123',
      username: 'testuser',
      email: 'test@example.com'
    });
  });

  describe('GET /api/bugs', () => {
    it('should return 400 if workspaceId is missing', async () => {
      const response = await request(app)
        .get('/api/bugs')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Workspace ID is required');
    });

    it('should return 403 if user not authorized for workspace', async () => {
      const mockWorkspace = {
        _id: 'workspace123',
        members: [{ userId: 'otheruser' }] 
      };

      Workspace.findById.mockResolvedValue(mockWorkspace);

      const response = await request(app)
        .get('/api/bugs?workspaceId=workspace123')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Not authorized to access this workspace');
    });
  });

});