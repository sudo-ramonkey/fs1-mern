const {
  verifyToken,
  extractTokenFromHeader,
  isTestingToken,
  TESTING_MODE,
} = require("../utils/jwt");
const { User } = require("../models");

/**
 * Middleware to authenticate user using JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        error: "Access denied. No token provided.",
        code: "NO_TOKEN",
      });
    }

    // Verify the token
    const decoded = verifyToken(token);

    // Handle testing token
    if (TESTING_MODE && isTestingToken(token)) {
      req.user = {
        _id: decoded.userId,
        id: decoded.userId,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
        isActive: true,
        testing: true,
        toPublicJSON: function () {
          return {
            _id: this._id,
            username: this.username,
            email: this.email,
            role: this.role,
            isActive: this.isActive,
            testing: this.testing,
          };
        },
      };
      return next();
    }

    // Find the user in the database
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        error: "Invalid token. User not found.",
        code: "USER_NOT_FOUND",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: "Account is deactivated.",
        code: "ACCOUNT_DEACTIVATED",
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.message === "Invalid or expired token") {
      return res.status(401).json({
        error: "Invalid or expired token.",
        code: "INVALID_TOKEN",
      });
    }

    return res.status(500).json({
      error: "Server error during authentication.",
      details: error.message,
    });
  }
};

/**
 * Middleware to authorize admin users only
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Authentication required.",
      code: "AUTH_REQUIRED",
    });
  }

  if (req.user.role !== "Admin") {
    return res.status(403).json({
      error: "Access denied. Admin privileges required.",
      code: "INSUFFICIENT_PRIVILEGES",
    });
  }

  next();
};

/**
 * Middleware to authorize specific roles
 * @param {Array|String} allowedRoles - Array of allowed roles or single role
 * @returns {Function} Middleware function
 */
const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required.",
        code: "AUTH_REQUIRED",
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required roles: ${roles.join(", ")}`,
        code: "INSUFFICIENT_PRIVILEGES",
      });
    }

    next();
  };
};

/**
 * Optional authentication middleware - doesn't fail if no token provided
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      req.user = null;
      return next();
    }

    // Verify the token
    const decoded = verifyToken(token);

    // Handle testing token
    if (TESTING_MODE && isTestingToken(token)) {
      req.user = {
        _id: decoded.userId,
        id: decoded.userId,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
        isActive: true,
        testing: true,
        toPublicJSON: function () {
          return {
            _id: this._id,
            username: this.username,
            email: this.email,
            role: this.role,
            isActive: this.isActive,
            testing: this.testing,
          };
        },
      };
      return next();
    }

    // Find the user in the database
    const user = await User.findById(decoded.userId).select("-password");

    if (user && user.isActive) {
      req.user = user;
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user
    req.user = null;
    next();
  }
};

/**
 * Middleware to check if user owns the resource or is admin
 * @param {String} userIdField - Field name containing user ID (default: 'userId')
 * @returns {Function} Middleware function
 */
const authorizeOwnerOrAdmin = (userIdField = "userId") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required.",
        code: "AUTH_REQUIRED",
      });
    }

    const resourceUserId = req.params[userIdField] || req.body[userIdField];
    const isOwner = req.user._id.toString() === resourceUserId;
    const isAdmin = req.user.role === "Admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: "Access denied. You can only access your own resources.",
        code: "INSUFFICIENT_PRIVILEGES",
      });
    }

    next();
  };
};

/**
 * Middleware to update user's last login time
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const updateLastLogin = async (req, res, next) => {
  if (req.user) {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        lastLogin: new Date(),
      });
    } catch (error) {
      // Log error but don't fail the request
      console.error("Error updating last login:", error);
    }
  }
  next();
};

module.exports = {
  authenticate,
  authorizeAdmin,
  authorizeRoles,
  optionalAuth,
  authorizeOwnerOrAdmin,
  updateLastLogin,
};
