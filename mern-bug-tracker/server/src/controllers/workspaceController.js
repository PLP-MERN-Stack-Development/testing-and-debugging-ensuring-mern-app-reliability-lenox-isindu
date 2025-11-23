const Workspace = require('../models/Workspace');
const User = require('../models/User');

// /workspaces
const getMyWorkspaces = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'workspaces.workspaceId',
      populate: {
        path: 'members.userId',
        select: 'username email'
      }
    });

    res.status(200).json({
      success: true,
      data: user.workspaces
    });
  } catch (error) {
    next(error);
  }
};

const createWorkspace = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Workspace name is required'
      });
    }

    // Use the static method to create workspace
    const workspace = await Workspace.createWorkspace({
      name,
      description: description || '',
      createdBy: userId,
      members: [{
        userId: userId,
        role: 'admin'
      }]
    });

    // Add workspace to user
    const user = await User.findById(userId);
    user.workspaces.push({
      workspaceId: workspace._id,
      role: 'admin'
    });
    await user.save();

    res.status(201).json({
      success: true,
      data: workspace
    });
  } catch (error) {
    next(error);
  }
};

//     Get workspace members

const getWorkspaceMembers = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId)
      .populate('members.userId', 'username email');

    if (!workspace) {
      return res.status(404).json({
        success: false,
        error: 'Workspace not found'
      });
    }

    // Check if user is member of workspace
    const isMember = workspace.members.some(
      member => member.userId._id.toString() === req.user.id
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this workspace'
      });
    }

    res.status(200).json({
      success: true,
      data: workspace.members
    });
  } catch (error) {
    next(error);
  }
};

//   Remove member from workspace

const removeMember = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        error: 'Workspace not found'
      });
    }

    // Check if requester is admin
    const requester = workspace.members.find(
      member => member.userId.toString() === req.user.id
    );

    if (!requester || requester.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to remove members'
      });
    }

    // Cannot remove yourself if you're the only admin
    if (req.params.memberId === req.user.id) {
      const adminCount = workspace.members.filter(m => m.role === 'admin').length;
      if (adminCount === 1) {
        return res.status(400).json({
          success: false,
          error: 'Cannot remove yourself as the only admin'
        });
      }
    }

    // Remove member from workspace
    workspace.members = workspace.members.filter(
      member => member.userId.toString() !== req.params.memberId
    );
    await workspace.save();

    // Remove workspace from user
    await User.findByIdAndUpdate(req.params.memberId, {
      $pull: { workspaces: { workspaceId: workspace._id } }
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyWorkspaces,
  getWorkspaceMembers,
  removeMember,
  createWorkspace
};