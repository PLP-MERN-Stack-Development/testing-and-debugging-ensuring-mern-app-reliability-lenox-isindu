const jwt = require('jsonwebtoken');
const { protect, authorize } = require('../../src/middleware/authMiddleware');
const User = require('../../src/models/User');

// Mock User model
jest.mock('../../src/models/User');

describe('Auth Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('protect middleware', () => {
    it('should return 401 if no token provided', async () => {
      await protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Not authorized to access this route'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid token', async () => {
      mockReq.headers.authorization = 'Bearer invalid_token';

      await protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Not authorized to access this route'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should set req.user and call next for valid token', async () => {
      const mockUser = { _id: 'user123', username: 'testuser' };
      const token = jwt.sign({ id: 'user123' }, process.env.JWT_SECRET);
      
      mockReq.headers.authorization = `Bearer ${token}`;
      User.findById.mockResolvedValue(mockUser);

      await protect(mockReq, mockRes, mockNext);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 401 if user not found', async () => {
      const token = jwt.sign({ id: 'user123' }, process.env.JWT_SECRET);
      
      mockReq.headers.authorization = `Bearer ${token}`;
      User.findById.mockResolvedValue(null); 

      await protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Not authorized to access this route'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if token verification fails', async () => {
      mockReq.headers.authorization = 'Bearer invalid_token';

      await protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Not authorized to access this route'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('authorize middleware', () => {
    it('should call next if user role is authorized', () => {
      mockReq.user = { role: 'admin' };
      
      const middleware = authorize('admin', 'user');
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 403 if user role is not authorized', () => {
      mockReq.user = { role: 'user' };
      
      const middleware = authorize('admin');
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'User role user is not authorized to access this route'
      });
    });

    it('should handle missing user object', () => {
      mockReq.user = undefined; 
      
      const middleware = authorize('admin');
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'User role undefined is not authorized to access this route'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});