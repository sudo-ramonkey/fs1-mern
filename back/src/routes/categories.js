const express = require("express");
const router = express.Router();

const categoriesController = require("../controllers/categories");
const {
  authenticate,
  authorizeAdmin,
  optionalAuth,
} = require("../middleware/auth");

// Public routes (no authentication required)

// GET /api/categories - Get all categories (tree or flat)
// Query params: includeInactive, maxDepth, parentId, format
router.get("/", optionalAuth, categoriesController.getAllCategories);

// GET /api/categories/roots - Get root categories only
router.get("/roots", optionalAuth, categoriesController.getRootCategories);

// GET /api/categories/search - Search categories
// Query params: q (required), limit
router.get("/search", optionalAuth, categoriesController.searchCategories);

// GET /api/categories/slug/:slug - Get category by slug
router.get("/slug/:slug", optionalAuth, categoriesController.getCategoryBySlug);

// Admin-only routes (require authentication and admin privileges)

// PUT /api/categories/reorder - Reorder categories within same parent
// Body: { categoryOrders: [{ id, sortOrder }] }
router.put(
  "/reorder",
  authenticate,
  authorizeAdmin,
  categoriesController.reorderCategories
);

// PUT /api/categories/update-product-counts - Update product counts for all categories
router.put(
  "/update-product-counts",
  authenticate,
  authorizeAdmin,
  categoriesController.updateProductCounts
);

// POST /api/categories - Create new category
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  categoriesController.createCategory
);

// GET /api/categories/:id - Get single category with optional related data
// Query params: includeProducts, includeAncestors, includeDescendants, includeSiblings
router.get("/:id", optionalAuth, categoriesController.getCategoryById);

// GET /api/categories/:id/breadcrumb - Get breadcrumb path for category
router.get("/:id/breadcrumb", optionalAuth, categoriesController.getCategoryBreadcrumb);

// PUT /api/categories/:id/move - Move category to new parent
// Body: { newParentId, newPosition }
router.put(
  "/:id/move",
  authenticate,
  authorizeAdmin,
  categoriesController.moveCategory
);

// PUT /api/categories/:id - Update category
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  categoriesController.updateCategory
);

// DELETE /api/categories/:id - Delete category
// Body: { moveProductsTo?, moveChildrenTo?, force? }
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  categoriesController.deleteCategory
);

module.exports = router;
