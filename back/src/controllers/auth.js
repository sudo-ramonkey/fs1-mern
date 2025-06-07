const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const { validatePassword } = require('../utils/password');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
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
      address
    };

    // Only allow admins to create admin users
    if (role === 'Admin') {
      if (!req.user || req.user.role !== 'Admin') {
        return res.status(403).json({
          error: 'Only admins can create admin accounts',
          code: 'INSUFFICIENT_PRIVILEGES'
        });
      }
      userData.role = 'Admin';
    }

    // Create new user
    const user = new User(userData);
    await user.save();

    // Generate token
    const token = generateToken({
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    // Return user data without password
    const userResponse = user.toPublicJSON();

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
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
      error: 'Server error during registration',
      details: error.message
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { login, password } = req.body;

    // Validate required fields
    if (!login || !password) {
      return res.status(400).json({
        error: 'Login (username or email) and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // Find user by email or username
    const user = await User.findByLogin(login);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    // Return user data without password
    const userResponse = user.toPublicJSON();

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error during login',
      details: error.message
    });
  }
};

/**
 * Get current user profile
 * GET /api/auth/profile
 */
const getProfile = async (req, res) => {
  try {
    // req.user is set by authentication middleware
    const userResponse = req.user.toPublicJSON();

    res.json({
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error fetching profile',
      details: error.message
    });
  }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    // Fields that users cannot update themselves
    const restrictedFields = ['role', 'isActive', 'password'];

    // Remove restricted fields unless user is admin updating someone else
    if (req.user.role !== 'Admin' || req.params.userId === userId.toString()) {
      restrictedFields.forEach(field => delete updates[field]);
    }

    // If email is being updated, check for duplicates
    if (updates.email) {
      const existingUser = await User.findOne({
        email: updates.email.toLowerCase(),
        _id: { $ne: userId }
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
        _id: { $ne: userId }
      });

      if (existingUser) {
        return res.status(409).json({
          error: 'Username already in use',
          code: 'USERNAME_EXISTS'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
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
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
        code: 'VALIDATION_ERROR'
      });
    }

    res.status(500).json({
      error: 'Server error updating profile',
      details: error.message
    });
  }
};

/**
 * Change password
 * PUT /api/auth/change-password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Current password and new password are required',
        code: 'MISSING_PASSWORDS'
      });
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'New password validation failed',
        details: passwordValidation.errors,
        code: 'INVALID_PASSWORD'
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id);

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        error: 'Current password is incorrect',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error changing password',
      details: error.message
    });
  }
};

/**
 * Refresh token
 * POST /api/auth/refresh
 */
const refreshToken = async (req, res) => {
  try {
    // req.user is set by authentication middleware
    const user = req.user;

    // Generate new token
    const token = generateToken({
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    res.json({
      message: 'Token refreshed successfully',
      token
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error refreshing token',
      details: error.message
    });
  }
};

/**
 * Logout (client-side token invalidation)
 * POST /api/auth/logout
 */
const logout = (req, res) => {
  // Since we're using stateless JWT tokens, logout is handled client-side
  // by removing the token from storage
  res.json({
    message: 'Logout successful. Please remove the token from client storage.'
  });
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  logout
};
