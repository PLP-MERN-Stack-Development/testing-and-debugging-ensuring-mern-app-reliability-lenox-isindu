const request = require('supertest');
const createTestApp = require('../test-app');
const User = require('../../src/models/User');
const Workspace = require('../../src/models/Workspace');

// Mock models for E2E tests
jest.mock('../../src/models/User');
jest.mock('../../src/models/Workspace');
jest.mock('../../src/models/Bug');

describe('Auth End-to-End Tests', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe('User Registration and Login Flow', () => {
    it('should complete full user registration and login flow', async () => {
      // Mock User.findOne to return null (no existing user)
      User.findOne.mockResolvedValue(null);
      
      // Mock User.create to return a new user
      const mockUser = {
        _id: 'user123',
        username: 'e2euser',
        email: 'e2e@example.com',
        workspaces: [],
        save: jest.fn().mockResolvedValue(true)
      };
      User.create.mockResolvedValue(mockUser);

      // Mock Workspace.create
      const mockWorkspace = {
        _id: 'workspace123',
        name: 'E2E Test Workspace',
        code: 'E2E123'
      };
      Workspace.create.mockResolvedValue(mockWorkspace);

      // Step 1: Register a new user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'e2euser',
          email: 'e2e@example.com',
          password: 'password123',
          workspaceName: 'E2E Test Workspace'
        })
        .expect(201);

      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.token).toBeDefined();
      expect(registerResponse.body.user.username).toBe('e2euser');
      expect(registerResponse.body.workspaceCreated).toBe(true);

      const authToken = registerResponse.body.token;

      // Step 2: Test accessing a protected route
      // Mock User.findById for the protect middleware
      User.findById.mockResolvedValue(mockUser);

      // Mock User.findOne for login
      const mockUserWithPassword = {
        ...mockUser,
        matchPassword: jest.fn().mockResolvedValue(true)
      };
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUserWithPassword)
      });

      // Step 3: Login with the new user
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'e2e@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.token).toBeDefined();
    });

    it('should handle registration without workspace', async () => {
      User.findOne.mockResolvedValue(null);
      
      const mockUser = {
        _id: 'user123',
        username: 'noworkspaceuser',
        email: 'noworkspace@example.com',
        workspaces: [],
        save: jest.fn().mockResolvedValue(true)
      };
      User.create.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'noworkspaceuser',
          email: 'noworkspace@example.com',
          password: 'password123'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.workspaceCreated).toBe(false);
    });
  });
});