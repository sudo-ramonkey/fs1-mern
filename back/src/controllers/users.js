const { User } = require('../models');
const { validatePassword } = require('../utils/password');

/**
 * Get all users (Admin only)
 * GET /api/users
 */
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      isActive,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error fetching users',
      details: error.message
    });
  }
};

/**
 * Get user by ID (Admin only)
 * GET /api/users/:id
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      user: user.toPublicJSON()
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid user ID format',
        code: 'INVALID_ID'
      });
    }

    res.status(500).json({
      error: 'Server error fetching user',
      details: error.message
    });
  }
};

/**
 * Create new user (Admin only)
 * POST /api/users
 */
const createUser = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone, address, role } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Username, email, and password are required',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Password validation failed',
        details: passwordValidation.errors,
        code: 'INVALID_PASSWORD'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username }
      ]
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
      return res.status(409).json({
        error: `User with this ${field} already exists`,
        code: 'USER_EXISTS'
      });
    }

    // Create user data object
    const userData = {
      username,
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      phone,
      address,
      role: role || 'User'
    };

    // Create new user
    const user = new User(userData);
    await user.save();

    // Return user data without password
    const userResponse = user.toPublicJSON();

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        error: `User with this ${field} already exists`,
        code: 'DUPLICATE_FIELD'
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
        code: 'VALIDATION_ERROR'
      });
    }

    res.status(500).json({
      error: 'Server error creating user',
      details: error.message
    });
  }
};

/**
 * Update user (Admin only)
 * PUT /api/users/:id
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove password from updates (use separate endpoint for password changes)
    delete updates.password;

    // If email is being updated, check for duplicates
    if (updates.email) {
      const existingUser = await User.findOne({
        email: updates.email.toLowerCase(),
        _id: { $ne: id }
      });

      if (existingUser) {
        return res.status(409).json({
          error: 'Email already in use',
          code: 'EMAIL_EXISTS'
        });
      }
      updates.email = updates.email.toLowerCase();
    }

    // If username is being updated, check for duplicates
    if (updates.username) {
      const existingUser = await User.findOne({
        username: updates.username,
        _id: { $ne: id }
      });

      if (existingUser) {
        return res.status(409).json({
          error: 'Username already in use',
          code: 'USERNAME_EXISTS'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const userResponse = user.toPublicJSON();

    res.json({
      message: 'User updated successfully',
      user: userResponse
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid user ID format',
        code: 'INVALID_ID'
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
        code: 'VALIDATION_ERROR'
      });
    }

    res.status(500).json({
      error: 'Server error updating user',
      details: error.message
    });
  }
};

/**
 * Delete user (Admin only)
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        error: 'Cannot delete your own account',
        code: 'CANNOT_DELETE_SELF'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    await User.findByIdAndDelete(id);

    res.json({
      message: 'User deleted successfully',
      deletedUser: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid user ID format',
        code: 'INVALID_ID'
      });
    }

    res.status(500).json({
      error: 'Server error deleting user',
      details: error.message
    });
  }
};

/**
 * Toggle user active status (Admin only)
 * PATCH /api/users/:id/toggle-active
 */
const toggleUserActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deactivating themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        error: 'Cannot change your own active status',
        code: 'CANNOT_MODIFY_SELF'
      });
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    const userResponse = user.toPublicJSON();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: userResponse
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid user ID format',
        code: 'INVALID_ID'
      });
    }

    res.status(500).json({
      error: 'Server error updating user status',
      details: error.message
    });
  }
};

/**
 * Reset user password (Admin only)
 * PATCH /api/users/:id/reset-password
 */
const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        error: 'New password is required',
        code: 'MISSING_PASSWORD'
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Password validation failed',
        details: passwordValidation.errors,
        code: 'INVALID_PASSWORD'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password reset successfully'
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid user ID format',
        code: 'INVALID_ID'
      });
    }

    res.status(500).json({
      error: 'Server error resetting password',
      details: error.message
    });
  }
};

/**
 * Get user statistics (Admin only)
 * GET /api/users/stats
 */
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });
    const adminUsers = await User.countDocuments({ role: 'Admin' });
    const regularUsers = await User.countDocuments({ role: 'User' });

    // Get users created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get users who logged in recently
    const recentlyActive = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo }
    });

    res.json({
      stats: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        admins: adminUsers,
        regular: regularUsers,
        recentSignups: recentUsers,
        recentlyActive: recentlyActive
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error fetching user statistics',
      details: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserActiveStatus,
  resetUserPassword,
  getUserStats
};
