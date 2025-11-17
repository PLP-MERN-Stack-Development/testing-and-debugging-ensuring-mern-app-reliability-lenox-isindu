const express = require('express');
const cors = require('cors');
const bugRoutes = require('./routes/bugRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bugs', bugRoutes);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;