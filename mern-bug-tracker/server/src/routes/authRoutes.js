const express = require('express');
const {
  register,
  login,
  joinWorkspace,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/join-workspace', protect, joinWorkspace);

module.exports = router;