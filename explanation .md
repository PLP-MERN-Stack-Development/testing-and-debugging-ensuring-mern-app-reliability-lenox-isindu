Project Overview
A comprehensive bug tracking system built with the MERN stack (MongoDB, Express.js, React, Node.js) with full testing implementation for both frontend and backend.

Project Structure
text
mern-bug-tracker/
├── backend/                 # Node.js/Express Backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   └── config/          # Database configuration
│   ├── tests/
│   │   ├── unit/           # Unit tests
│   │   ├── integration/    # Integration tests
│   │   └── e2e/            # End-to-end tests
│   ├── jest.config.js      # Jest configuration
│   └── package.json
│
└── frontend/               # React Frontend
    ├── src/
    │   ├── components/     # React components
    │   ├── contexts/       # React contexts
    │   ├── services/       # API services
    │   ├── __tests__/      # All frontend tests
    │   └── App.jsx         # Main application
    ├── jest.config.js     # Jest configuration
    ├── babel.config.cjs    # Babel configuration
    └── package.json


🛠️ Installation & Setup
Backend Setup


cd mern-bug-tracker/backend

# Install dependencies
npm install

# Environment Setup
# Create .env file with:
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bugtracker ----samploe
JWT_SECRET=your_jwt_secret_key

# Start the server
npm run dev          # Development mode
npm start           # Production mode
Frontend Setup
bash
# Navigate to frontend directory
cd mern-bug-tracker/frontend

# Install dependencies
npm install

# Start the development server
npm run dev          # Vite development server
npm run build        # Production build


 Testing Implementation
Backend Testing
Test Structure
text
backend/tests/
├── unit/
│   ├── authMiddleware.test.js
│   ├── errorMiddleware.test.js
│   └── basic.test.js
├── integration/
│   ├── authController.test.js
│   ├── bugController.test.js
│   └── workspaceController.test.js
└── e2e/
    ├── auth.e2e.test.js
    ├── workspace.e2e.test.js
    └── bugTracking.e2e.test.js
Running Backend Tests
bash
cd backend

# Run all tests
npm test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e





Frontend Testing


Test Structure
text
frontend/src/__tests__/
├── BugCard.test.js         # Bug card component tests
├── BugForm.test.js         # Bug form component tests  
├── BugList.test.js         # Bug list component tests
├── LoginPage.test.js       # Authentication tests
└── SignupPage.test.js      # Registration tests
Running Frontend Tests
bash
cd frontend

# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run specific test suites
npm run test:unit
npm run test:integration



API Endpoints Tested

Authentication Endpoints
POST /api/auth/register - User registration

POST /api/auth/login - User login

POST /api/auth/join-workspace - Join workspace with code

Workspace Endpoints
GET /api/workspaces - Get user's workspaces

POST /api/workspaces - Create new workspace

GET /api/workspaces/:workspaceId/members - Get workspace members

Bug Endpoints
GET /api/bugs - Get bugs (requires workspaceId query)

POST /api/bugs - Create new bug

PUT /api/bugs/:id - Update bug

DELETE /api/bugs/:id - Delete bug



 Security Testing

Backend Security
JWT token validation

Password hashing with bcrypt

Route protection middleware

Input validation and sanitization

CORS configuration

Frontend Security

HTTP-only cookie implementation

Session storage for user data

Protected route components

Input sanitization


 Running Complete Application
Development Mode
bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend  
cd frontend
npm run dev



Production Mode
bash
# Build frontend
cd frontend
npm run build

# Start backend (serves built frontend)
cd backend
npm start
Running All Tests
bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test



