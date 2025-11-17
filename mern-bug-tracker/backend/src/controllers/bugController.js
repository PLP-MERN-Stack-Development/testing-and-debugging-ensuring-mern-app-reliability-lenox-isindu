const Bug = require('../models/Bug');

const getBugs = async (req, res, next) => {
  try {
    const bugs = await Bug.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: bugs.length,
      data: bugs
    });
  } catch (error) {
    next(error);
  }
};


const createBug = async (req, res, next) => {
  try {
    const bug = await Bug.create(req.body);
    res.status(201).json({
      success: true,
      data: bug
    });
  } catch (error) {
    next(error);
  }
};


const updateBug = async (req, res, next) => {
  try {
    const bug = await Bug.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!bug) {
      return res.status(404).json({
        success: false,
        error: 'Bug not found'
      });
    }

    res.status(200).json({
      success: true,
      data: bug
    });
  } catch (error) {
    next(error);
  }
};


const deleteBug = async (req, res, next) => {
  try {
    const bug = await Bug.findByIdAndDelete(req.params.id);

    if (!bug) {
      return res.status(404).json({
        success: false,
        error: 'Bug not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBugs,
  createBug,
  updateBug,
  deleteBug
};