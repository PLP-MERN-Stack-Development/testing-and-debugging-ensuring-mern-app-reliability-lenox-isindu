const express = require('express');
const {
  getBugs,
  createBug,
  updateBug,
  deleteBug
} = require('../controllers/bugController');

const router = express.Router();

router.route('/')
  .get(getBugs)
  .post(createBug);

router.route('/:id')
  .put(updateBug)
  .delete(deleteBug);

module.exports = router;