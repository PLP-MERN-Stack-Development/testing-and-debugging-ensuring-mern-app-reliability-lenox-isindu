const express = require('express');
const errorMiddleware = require('../src/middleware/errorMiddleware');

// Import routes - use the correct file names
const authRoutes = require('../src/routes/authRoutes');  // Changed from auth.js
const bugRoutes = require('../src/routes/bugRoutes');    // Changed from bugs.js  
const workspaceRoutes = require('../src/routes/workspaceRoutes');  // Changed from workspaces.js

const createTestApp = () => {
  const app = express();

  // Body parser middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/bugs', bugRoutes);
  app.use('/api/workspaces', workspaceRoutes);

  // Error middleware
  app.use(errorMiddleware);

  return app;
};

module.exports = createTestApp;