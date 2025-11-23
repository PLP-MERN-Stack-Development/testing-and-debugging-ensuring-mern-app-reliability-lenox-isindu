const request = require('supertest');
const createTestApp = require('../test-app');
const User = require('../../src/models/User');
const Workspace = require('../../src/models/Workspace');

// Mock models
jest.mock('../../src/models/User');
jest.mock('../../src/models/Workspace');

describe('Auth Controller', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        workspaceName: 'Test Workspace'
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        workspaces: [],
        save: jest.fn().mockResolvedValue(true)
      });

      Workspace.create.mockResolvedValue({
        _id: 'workspace123',
        name: 'Test Workspace',
        code: 'ABC123'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.username).toBe('testuser');
      expect(response.body.workspaceCreated).toBe(true);
    });

    it('should return 400 if user already exists', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue({
        username: 'testuser',
        email: 'test@example.com'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already exists');
    });

    it('should register without workspace if no workspaceName provided', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        workspaces: [],
        save: jest.fn().mockResolvedValue(true)
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.workspaceCreated).toBe(false);
      expect(Workspace.create).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        username: 'testuser',
        workspaces: [],
        matchPassword: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid credentials');
    });

    it('should validate workspace access if workspaceCode provided', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
        workspaceCode: 'ABC123'
      };

      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        username: 'testuser',
        workspaces: [{ workspaceId: 'workspace123' }],
        matchPassword: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      Workspace.findOne.mockResolvedValue({
        _id: 'workspace123',
        code: 'ABC123'
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});