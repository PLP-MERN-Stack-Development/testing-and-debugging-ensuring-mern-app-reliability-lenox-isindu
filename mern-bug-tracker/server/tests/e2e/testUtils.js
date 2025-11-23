const request = require('supertest');
const createTestApp = require('../test-app');
const User = require('../../src/models/User');

describe('Auth End-to-End Tests', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('User Registration and Login Flow', () => {
    it('should complete full user registration and login flow', async () => {
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

      // Step 2: Login with the new user
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'e2e@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.token).toBeDefined();

      // Step 3: Access protected route with token
      const workspacesResponse = await request(app)
        .get('/api/workspaces')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(workspacesResponse.body.success).toBe(true);
      expect(Array.isArray(workspacesResponse.body.data)).toBe(true);
    });

    it('should prevent login with invalid credentials', async () => {
      // First create a user
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      // Try to login with wrong password
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid credentials');
    });

    it('should prevent duplicate user registration', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'duplicateuser',
          email: 'duplicate@example.com',
          password: 'password123'
        })
        .expect(201);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'differentuser',
          email: 'duplicate@example.com',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already exists');
    });
  });
});