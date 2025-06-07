const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const { authenticate, optionalAuth } = require('../middleware/auth');

/**
 * Public routes (no authentication required)
 */

// Register new user
// POST /api/auth/register
router.post('/register', optionalAuth, authController.register);

// Login user
// POST /api/auth/login
router.post('/login', authController.login);

/**
 * Protected routes (authentication required)
 */

// Get current user profile
// GET /api/auth/profile
router.get('/profile', authenticate, authController.getProfile);

// Update current user profile
// PUT /api/auth/profile
router.put('/profile', authenticate, authController.updateProfile);

// Change password
// PUT /api/auth/change-password
router.put('/change-password', authenticate, authController.changePassword);

// Refresh token
// POST /api/auth/refresh
router.post('/refresh', authenticate, authController.refreshToken);

// Logout (client-side token invalidation)
// POST /api/auth/logout
router.post('/logout', authenticate, authController.logout);

module.exports = router;
