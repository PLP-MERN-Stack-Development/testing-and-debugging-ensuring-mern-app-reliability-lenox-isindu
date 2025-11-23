const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bugRoutes = require('./routes/bugRoutes');
const authRoutes = require('./routes/authRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors({
  origin: true, //   frontend URL like 'http://localhost:5173'
  credentials: true //Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser()); 
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/bugs', bugRoutes);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;