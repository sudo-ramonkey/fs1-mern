const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

/**
 * All routes require admin authentication
 */
router.use(authenticate);
router.use(authorizeAdmin);

/**
 * User statistics
 */

// Get user statistics
// GET /api/users/stats
router.get('/stats', usersController.getUserStats);

/**
 * User CRUD operations
 */

// Get all users with filtering and pagination
// GET /api/users
router.get('/', usersController.getAllUsers);

// Create new user
// POST /api/users
router.post('/', usersController.createUser);

// Get user by ID
// GET /api/users/:id
router.get('/:id', usersController.getUserById);

// Update user
// PUT /api/users/:id
router.put('/:id', usersController.updateUser);

// Delete user
// DELETE /api/users/:id
router.delete('/:id', usersController.deleteUser);

/**
 * User management operations
 */

// Toggle user active status
// PATCH /api/users/:id/toggle-active
router.patch('/:id/toggle-active', usersController.toggleUserActiveStatus);

// Reset user password
// PATCH /api/users/:id/reset-password
router.patch('/:id/reset-password', usersController.resetUserPassword);

module.exports = router;
