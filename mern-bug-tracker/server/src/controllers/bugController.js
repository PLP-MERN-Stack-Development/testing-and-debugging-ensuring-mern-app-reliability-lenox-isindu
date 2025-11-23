const Bug = require('../models/Bug');
const Workspace = require('../models/Workspace');

const getBugs = async (req, res, next) => {
  try {
    const { workspaceId } = req.query;

    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        error: 'Workspace ID is required'
      });
    }

    // Verify user has access to workspace
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({
        success: false,
        error: 'Workspace not found'
      });
    }

    const hasAccess = workspace.members.some(
      member => member.userId.toString() === req.user.id
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this workspace'
      });
    }

    const bugs = await Bug.find({ workspaceId })
      .populate('reporter', 'username email')
      .populate('assignee', 'username email')
      .sort({ createdAt: -1 });

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
    const { workspaceId, ...bugData } = req.body;

    // Verify user has access to workspace
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({
        success: false,
        error: 'Workspace not found'
      });
    }

    const hasAccess = workspace.members.some(
      member => member.userId.toString() === req.user.id
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this workspace'
      });
    }

    // Verify assignee is in workspace 
    if (bugData.assignee) {
      const isAssigneeMember = workspace.members.some(
        member => member.userId.toString() === bugData.assignee
      );
      
      if (!isAssigneeMember) {
        return res.status(400).json({
          success: false,
          error: 'Assignee must be a workspace member'
        });
      }
    }

    const bug = await Bug.create({
      ...bugData,
      workspaceId,
      reporter: req.user.id
    });

 
    const populatedBug = await Bug.findById(bug._id)
      .populate('reporter', 'username email')
      .populate('assignee', 'username email');

    res.status(201).json({
      success: true,
      data: populatedBug
    });
  } catch (error) {
    next(error);
  }
};


const updateBug = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate('reporter', 'username email')
      .populate('assignee', 'username email');

    if (!bug) {
      return res.status(404).json({
        success: false,
        error: 'Bug not found'
      });
    }

    // Verify user has access to the bug's workspace
    const workspace = await Workspace.findById(bug.workspaceId);
    const hasAccess = workspace.members.some(
      member => member.userId.toString() === req.user.id
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this bug'
      });
    }

    // Check if user is the assignee (for status changes)
    if (req.body.status && bug.assignee && bug.assignee._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Only the assigned user can change bug status'
      });
    }

    // Verify assignee is in workspace if provided
    if (req.body.assignee) {
      const isAssigneeMember = workspace.members.some(
        member => member.userId.toString() === req.body.assignee
      );
      
      if (!isAssigneeMember) {
        return res.status(400).json({
          success: false,
          error: 'Assignee must be a workspace member'
        });
      }
    }

    const updatedBug = await Bug.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('reporter', 'username email')
     .populate('assignee', 'username email');

    res.status(200).json({
      success: true,
      data: updatedBug
    });
  } catch (error) {
    next(error);
  }
};

const deleteBug = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate('reporter', 'username email')
      .populate('assignee', 'username email');

    if (!bug) {
      return res.status(404).json({
        success: false,
        error: 'Bug not found'
      });
    }

    // Verify user has access to the bug's workspace
    const workspace = await Workspace.findById(bug.workspaceId);
    const hasAccess = workspace.members.some(
      member => member.userId.toString() === req.user.id
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this bug'
      });
    }

    // Check if user is the reporter or assignee
    const isReporter = bug.reporter && bug.reporter._id.toString() === req.user.id;
    const isAssignee = bug.assignee && bug.assignee._id.toString() === req.user.id;
    
    if (!isReporter && !isAssignee) {
      return res.status(403).json({
        success: false,
        error: 'Only the reporter or assignee can delete this bug'
      });
    }

    await Bug.findByIdAndDelete(req.params.id);

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