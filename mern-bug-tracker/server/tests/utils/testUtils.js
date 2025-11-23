const jwt = require('jsonwebtoken');

const generateTestToken = (userId = 'testuser123') => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'test_jwt_secret');
};

const mockUser = (overrides = {}) => ({
  _id: 'user123',
  username: 'testuser',
  email: 'test@example.com',
  workspaces: [],
  ...overrides
});

const mockWorkspace = (overrides = {}) => ({
  _id: 'workspace123',
  name: 'Test Workspace',
  code: 'TEST123',
  createdBy: 'user123',
  members: [{ userId: 'user123', role: 'admin' }],
  ...overrides
});

const mockBug = (overrides = {}) => ({
  _id: 'bug123',
  title: 'Test Bug',
  description: 'Test bug description',
  priority: 'medium',
  status: 'open',
  workspaceId: 'workspace123',
  reporter: { _id: 'user123', username: 'testuser', email: 'test@example.com' },
  assignee: null,
  ...overrides
});

module.exports = {
  generateTestToken,
  mockUser,
  mockWorkspace,
  mockBug
};