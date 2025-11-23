const express = require('express');
const {
  getBugs,
  createBug,
  updateBug,
  deleteBug
} = require('../controllers/bugController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// protect middleware to all routes
router.use(protect);

router.route('/')
  .get(getBugs)
  .post(createBug);

router.route('/:id')
  .put(updateBug)
  .delete(deleteBug);

module.exports = router;