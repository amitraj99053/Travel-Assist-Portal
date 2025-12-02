const User = require('../models/User');
const Mechanic = require('../models/Mechanic');
const ServiceRequest = require('../models/ServiceRequest');
const { successResponse, errorResponse } = require('../utils/response');

// Verify mechanic
exports.verifyMechanic = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Forbidden: Only admin can verify mechanics');
    }

    const { mechanicId } = req.params;

    const mechanic = await Mechanic.findByIdAndUpdate(
      mechanicId,
      {
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy: req.user._id,
      },
      { new: true }
    );

    successResponse(res, 200, 'Mechanic verified successfully', {
      id: mechanic._id,
      isVerified: mechanic.isVerified,
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to verify mechanic: ' + error.message);
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Forbidden: Only admin can view users');
    }

    const { page = 1, limit = 10, role } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    successResponse(res, 200, 'Users fetched', {
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to fetch users: ' + error.message);
  }
};

// Get pending mechanics
exports.getPendingMechanics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Forbidden: Only admin can view mechanics');
    }

    const pendingMechanics = await Mechanic.find({ isVerified: false })
      .populate('userId', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    successResponse(res, 200, 'Pending mechanics fetched', pendingMechanics);
  } catch (error) {
    errorResponse(res, 500, 'Failed to fetch pending mechanics: ' + error.message);
  }
};

// Get admin dashboard
exports.getAdminDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Forbidden: Only admin can view dashboard');
    }

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalMechanics = await User.countDocuments({ role: 'mechanic' });
    const verifiedMechanics = await Mechanic.countDocuments({ isVerified: true });
    const pendingMechanics = await Mechanic.countDocuments({ isVerified: false });
    const totalRequests = await ServiceRequest.countDocuments();

    successResponse(res, 200, 'Dashboard fetched', {
      stats: {
        totalUsers,
        totalMechanics,
        verifiedMechanics,
        pendingMechanics,
        totalRequests,
      },
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to fetch dashboard: ' + error.message);
  }
};

// Reject mechanic
exports.rejectMechanic = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Forbidden: Only admin can reject mechanics');
    }

    const { mechanicId } = req.params;

    // Delete mechanic profile
    await Mechanic.findByIdAndDelete(mechanicId);

    // Optionally delete user account or deactivate
    const mechanic = await Mechanic.findById(mechanicId);
    if (mechanic) {
      await User.findByIdAndUpdate(mechanic.userId, { isActive: false });
    }

    successResponse(res, 200, 'Mechanic rejected');
  } catch (error) {
    errorResponse(res, 500, 'Failed to reject mechanic: ' + error.message);
  }
};

// Block/Unblock user
exports.toggleUserBlock = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Forbidden: Only admin can block users');
    }

    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    user.isActive = !user.isActive;
    await user.save();

    successResponse(res, 200, 'User status updated', {
      isActive: user.isActive,
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to update user: ' + error.message);
  }
};
