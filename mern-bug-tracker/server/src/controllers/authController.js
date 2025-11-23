const User = require('../models/User');
const Workspace = require('../models/Workspace');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// /register
const register = async (req, res, next) => {
  try {
    const { username, email, password, workspaceName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email or username already exists'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    // Create workspace if name provided
    let workspace;
    if (workspaceName) {
      // Generate a temporary code for initial creation
      const generateTempCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      workspace = await Workspace.create({
        name: workspaceName,
        code: generateTempCode(), 
        createdBy: user._id,
        members: [{
          userId: user._id,
          role: 'admin'
        }]
      });

      // Add workspace to user
      user.workspaces.push({
        workspaceId: workspace._id,
        role: 'admin'
      });
      await user.save();
    }

    // Send token response
    sendTokenResponse(user, 201, res, {
      workspaceCreated: !!workspace,
      workspace: workspace
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password, workspaceCode } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email and password'
      });
    }

    // Check for user (include password for verification)
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check workspace access if code provided
    if (workspaceCode) {
      const workspace = await Workspace.findOne({ code: workspaceCode.toUpperCase() });
      if (!workspace) {
        return res.status(404).json({
          success: false,
          error: 'Workspace not found'
        });
      }

      // Check if user is member of workspace
      const isMember = user.workspaces.some(ws => 
        ws.workspaceId.toString() === workspace._id.toString()
      );

      if (!isMember) {
        return res.status(403).json({
          success: false,
          error: 'You are not a member of this workspace'
        });
      }
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};


// join-workspace
const joinWorkspace = async (req, res, next) => {
  try {
    const { workspaceCode } = req.body;
    const userId = req.user.id;

    // Find workspace
    const workspace = await Workspace.findOne({ code: workspaceCode.toUpperCase() });
    if (!workspace) {
      return res.status(404).json({
        success: false,
        error: 'Workspace not found'
      });
    }

    // Check if already a member
    const existingMember = workspace.members.find(
      member => member.userId.toString() === userId
    );
    
    if (existingMember) {
      return res.status(400).json({
        success: false,
        error: 'You are already a member of this workspace'
      });
    }

    // Add user to workspace
    workspace.members.push({
      userId: userId,
      role: 'member'
    });
    await workspace.save();

    // Add workspace to user
    const user = await User.findById(userId);
    user.workspaces.push({
      workspaceId: workspace._id,
      role: 'member'
    });
    await user.save();

    res.status(200).json({
      success: true,
      data: workspace
    });
  } catch (error) {
    next(error);
  }
};


const logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(Date.now() + 5 * 1000),
  });
  
  res.status(200).json({
    success: true,
    data: {}
  });
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, additionalData = {}) => {
  // Create token
  const token = generateToken(user._id);

  // Set HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  res.status(statusCode).json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      workspaces: user.workspaces
    },
    ...additionalData
  });
};

module.exports = {
  register,
  login,
  joinWorkspace,
  logout
};