const express = require('express');
const {
  getMyWorkspaces,
  getWorkspaceMembers,
  removeMember,
  createWorkspace
} = require('../controllers/workspaceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getMyWorkspaces);
router.post('/create', protect, createWorkspace); 
router.get('/:workspaceId/members', protect, getWorkspaceMembers);
router.delete('/:workspaceId/members/:memberId', protect, removeMember);

module.exports = router;