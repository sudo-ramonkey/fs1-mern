const { Category, Producto } = require("../models");

// GET /api/categories - Get all categories (tree structure)
async function getAllCategories(req, res) {
  try {
    const {
      includeInactive = false,
      maxDepth = null,
      parentId = null,
      format = 'tree' // 'tree' or 'flat'
    } = req.query;

    let categories;

    if (format === 'flat') {
      const query = includeInactive ? {} : { isActive: true };
      if (parentId) query.parent = parentId;

      categories = await Category.find(query)
        .populate('parent', 'name slug level')
        .populate('children', 'name slug level sortOrder')
        .sort({ level: 1, sortOrder: 1, name: 1 })
        .lean();
    } else {
      // Return hierarchical tree structure
      const parsedMaxDepth = maxDepth ? parseInt(maxDepth) : null;
      const parsedParentId = parentId === 'null' ? null : parentId;
      
      categories = await Category.getTree(parsedParentId, parsedMaxDepth);
    }

    res.json({
      success: true,
      data: categories,
      meta: {
        total: Array.isArray(categories) ? categories.length : 0,
        format,
        maxDepth: maxDepth ? parseInt(maxDepth) : null,
        parentId
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching categories",
      details: error.message,
    });
  }
}

// GET /api/categories/roots - Get root categories only
async function getRootCategories(req, res) {
  try {
    const categories = await Category.find({ parent: null, isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    res.json({
      success: true,
      data: categories,
      meta: {
        total: categories.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching root categories",
      details: error.message,
    });
  }
}

// GET /api/categories/:id - Get single category with related data
async function getCategoryById(req, res) {
  try {
    const { id } = req.params;
    const {
      includeProducts = false,
      includeAncestors = false,
      includeDescendants = false,
      includeSiblings = false
    } = req.query;

    const category = await Category.findById(id)
      .populate('parent', 'name slug level')
      .populate('children', 'name slug level sortOrder');

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    const response = {
      success: true,
      data: category.toJSON()
    };

    // Include additional data if requested
    if (includeAncestors) {
      response.data.ancestors = await category.getAncestors();
    }

    if (includeDescendants) {
      response.data.descendants = await category.getDescendants();
    }

    if (includeSiblings) {
      response.data.siblings = await category.getSiblings();
    }

    if (includeProducts) {
      const products = await Producto.find({ category: id })
        .select('nombre precio imagenes stock')
        .limit(20);
      response.data.sampleProducts = products;
      response.data.totalProducts = await Producto.countDocuments({ category: id });
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching category",
      details: error.message,
    });
  }
}

// GET /api/categories/slug/:slug - Get category by slug
async function getCategoryBySlug(req, res) {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug, isActive: true })
      .lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching category by slug",
      details: error.message,
    });
  }
}

// POST /api/categories - Create new category
async function createCategory(req, res) {
  try {
    const {
      name,
      slug,
      description,
      parent,
      isActive = true,
      sortOrder = 0,
      icon,
      image,
      metaTitle,
      metaDescription
    } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Category name is required",
      });
    }

    // Check if parent exists (if provided)
    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          error: "Parent category not found",
        });
      }
    }

    // Check for duplicate slug
    if (slug) {
      const existingCategory = await Category.findOne({ slug });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          error: "Category with this slug already exists",
        });
      }
    }

    const categoryData = {
      name,
      description,
      parent: parent || null,
      isActive,
      sortOrder,
      icon,
      image,
      metaTitle,
      metaDescription
    };

    if (slug) categoryData.slug = slug;

    const category = new Category(categoryData);
    await category.save();

    // Populate the created category
    await category.populate('parent', 'name slug level');

    res.status(201).json({
      success: true,
      data: category,
      message: "Category created successfully"
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Category with this slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      error: "Error creating category",
      details: error.message,
    });
  }
}

// PUT /api/categories/:id - Update category
async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    // If moving to a different parent, validate the move
    if (updates.parent !== undefined && updates.parent !== category.parent?.toString()) {
      if (updates.parent && !(await category.canMoveTo(updates.parent))) {
        return res.status(400).json({
          success: false,
          error: "Cannot move category to the specified parent (would create circular reference or move to descendant)",
        });
      }
    }

    // Check for slug conflicts
    if (updates.slug && updates.slug !== category.slug) {
      const existingCategory = await Category.findOne({
        slug: updates.slug,
        _id: { $ne: id }
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          error: "Category with this slug already exists",
        });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('parent', 'name slug level');

    res.json({
      success: true,
      data: updatedCategory,
      message: "Category updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error updating category",
      details: error.message,
    });
  }
}

// PUT /api/categories/:id/move - Move category to new parent
async function moveCategory(req, res) {
  try {
    const { id } = req.params;
    const { newParentId, newPosition } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    // Validate the move
    if (newParentId && !(await category.canMoveTo(newParentId))) {
      return res.status(400).json({
        success: false,
        error: "Cannot move category to the specified parent",
      });
    }

    // Remove from old parent's children
    if (category.parent) {
      await Category.findByIdAndUpdate(
        category.parent,
        { $pull: { children: category._id } }
      );
    }

    // Update the category
    const updates = {
      parent: newParentId || null
    };

    if (newPosition !== undefined) {
      updates.sortOrder = newPosition;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('parent', 'name slug level');

    // Update descendants' paths and levels
    if (category.parent?.toString() !== newParentId) {
      // Recalculate paths for all descendants
      const updateDescendantPaths = async (categoryId) => {
        const cat = await Category.findById(categoryId);
        if (cat) {
          await cat.save(); // Triggers pre-save middleware to recalculate path and level
          
          // Update all children recursively
          const children = await Category.find({ parent: categoryId });
          for (let child of children) {
            await updateDescendantPaths(child._id);
          }
        }
      };
      
      await updateDescendantPaths(id);
    }

    res.json({
      success: true,
      data: updatedCategory,
      message: "Category moved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error moving category",
      details: error.message,
    });
  }
}

// DELETE /api/categories/:id - Delete category
async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const {
      moveProductsTo = null,
      moveChildrenTo = null,
      force = false
    } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    // Check if category has products
    const productCount = await Producto.countDocuments({ category: id });
    if (productCount > 0 && !moveProductsTo && !force) {
      return res.status(400).json({
        success: false,
        error: `Category has ${productCount} products. Specify moveProductsTo or use force=true`,
        meta: { productCount }
      });
    }

    // Check if category has children
    if (category.children.length > 0 && !moveChildrenTo && !force) {
      return res.status(400).json({
        success: false,
        error: `Category has ${category.children.length} child categories. Specify moveChildrenTo or use force=true`,
        meta: { childrenCount: category.children.length }
      });
    }

    // Move products if specified
    if (productCount > 0 && moveProductsTo) {
      const targetCategory = await Category.findById(moveProductsTo);
      if (!targetCategory) {
        return res.status(400).json({
          success: false,
          error: "Target category for products not found",
        });
      }

      await Producto.updateMany(
        { category: id },
        { category: moveProductsTo }
      );
    }

    // Move children if specified
    if (category.children.length > 0 && moveChildrenTo) {
      const targetCategory = await Category.findById(moveChildrenTo);
      if (!targetCategory) {
        return res.status(400).json({
          success: false,
          error: "Target category for children not found",
        });
      }

      await Category.updateMany(
        { parent: id },
        { parent: moveChildrenTo }
      );
    }

    // Delete the category (pre-remove middleware will handle cleanup)
    await category.deleteOne();

    res.json({
      success: true,
      message: "Category deleted successfully",
      meta: {
        productsAffected: productCount,
        childrenAffected: category.children.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error deleting category",
      details: error.message,
    });
  }
}

// GET /api/categories/search - Search categories
async function searchCategories(req, res) {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: "Search query is required",
      });
    }

    const categories = await Category.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } }
          ]
        }
      ]
    })
      .limit(parseInt(limit))
      .sort({ level: 1, name: 1 })
      .lean();

    res.json({
      success: true,
      data: categories,
      meta: {
        query: q,
        total: categories.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error searching categories",
      details: error.message,
    });
  }
}

// PUT /api/categories/update-product-counts - Update product counts for all categories
async function updateProductCounts(req, res) {
  try {
    await Category.updateProductCounts();

    res.json({
      success: true,
      message: "Product counts updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error updating product counts",
      details: error.message,
    });
  }
}

// GET /api/categories/:id/breadcrumb - Get breadcrumb path for category
async function getCategoryBreadcrumb(req, res) {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    const ancestors = await category.getAncestors();
    const breadcrumb = [...ancestors, category].map(cat => ({
      id: cat._id,
      name: cat.name,
      slug: cat.slug,
      level: cat.level
    }));

    res.json({
      success: true,
      data: breadcrumb
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching category breadcrumb",
      details: error.message,
    });
  }
}

// PUT /api/categories/reorder - Reorder categories within same parent
async function reorderCategories(req, res) {
  try {
    const { categoryOrders } = req.body; // Array of { id, sortOrder }

    if (!Array.isArray(categoryOrders)) {
      return res.status(400).json({
        success: false,
        error: "categoryOrders must be an array of { id, sortOrder }",
      });
    }

    // Update all categories in bulk
    const bulkOps = categoryOrders.map(({ id, sortOrder }) => ({
      updateOne: {
        filter: { _id: id },
        update: { sortOrder }
      }
    }));

    await Category.bulkWrite(bulkOps);

    res.json({
      success: true,
      message: "Categories reordered successfully",
      meta: {
        updated: categoryOrders.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error reordering categories",
      details: error.message,
    });
  }
}

module.exports = {
  getAllCategories,
  getRootCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  moveCategory,
  deleteCategory,
  searchCategories,
  updateProductCounts,
  getCategoryBreadcrumb,
  reorderCategories
};
