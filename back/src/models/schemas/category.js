const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    level: {
      type: Number,
      default: 0,
      min: 0,
    },
    path: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [60, "Meta title cannot exceed 60 characters"],
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },
    productCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better performance
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ path: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });
categorySchema.index({ name: "text", description: "text" });

// Pre-save middleware to generate slug and calculate level/path
categorySchema.pre("save", async function (next) {
  try {
    // Generate slug from name if not provided
    if (!this.slug && this.name) {
      let baseSlug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
      
      // Ensure slug is unique
      let slug = baseSlug;
      let counter = 1;
      while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      this.slug = slug;
    }

    // Calculate level and path based on parent
    if (this.parent) {
      const parent = await this.constructor.findById(this.parent);
      if (parent) {
        this.level = parent.level + 1;
        this.path = parent.path ? `${parent.path},${parent._id}` : parent._id.toString();
      } else {
        this.level = 0;
        this.path = "";
      }
    } else {
      this.level = 0;
      this.path = "";
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Post-save middleware to update parent's children array
categorySchema.post("save", async function (doc) {
  try {
    if (doc.parent) {
      await this.constructor.findByIdAndUpdate(
        doc.parent,
        { $addToSet: { children: doc._id } },
        { new: true }
      );
    }
  } catch (error) {
    console.error("Error updating parent children:", error);
  }
});

// Pre-remove middleware to handle cleanup when deleting categories
categorySchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      // Move children to parent or make them root categories
      if (this.children && this.children.length > 0) {
        await this.constructor.updateMany(
          { _id: { $in: this.children } },
          {
            $set: {
              parent: this.parent || null,
              level: this.parent ? this.level : 0,
            },
          }
        );
      }

      // Remove from parent's children array
      if (this.parent) {
        await this.constructor.findByIdAndUpdate(this.parent, {
          $pull: { children: this._id },
        });
      }

      // Update products to remove this category reference
      const Product = this.constructor.db.model("Producto");
      await Product.updateMany(
        { category: this._id },
        { $unset: { category: 1 } }
      );

      next();
    } catch (error) {
      next(error);
    }
  }
);

// Instance methods
categorySchema.methods.getAncestors = async function () {
  if (!this.path) return [];

  const ancestorIds = this.path.split(",").filter(Boolean);
  return await this.constructor
    .find({
      _id: { $in: ancestorIds },
    })
    .sort({ level: 1 });
};

categorySchema.methods.getDescendants = async function () {
  const pathRegex = new RegExp(
    `^${this.path ? this.path + "," : ""}${this._id}`,
  );
  return await this.constructor
    .find({
      path: pathRegex,
      _id: { $ne: this._id },
    })
    .sort({ level: 1, sortOrder: 1 });
};

categorySchema.methods.getSiblings = async function () {
  return await this.constructor
    .find({
      parent: this.parent,
      _id: { $ne: this._id },
    })
    .sort({ sortOrder: 1 });
};

categorySchema.methods.getFullPath = async function () {
  const ancestors = await this.getAncestors();
  return [...ancestors, this].map((cat) => cat.name).join(" > ");
};

categorySchema.methods.canMoveTo = async function (newParentId) {
  if (!newParentId) return true; // Can always move to root

  // Can't move to self
  if (this._id.equals(newParentId)) return false;

  // Can't move to own descendant
  const descendants = await this.getDescendants();
  return !descendants.some((desc) => desc._id.equals(newParentId));
};

// Static methods
categorySchema.statics.getTree = async function (
  parentId = null,
  maxDepth = null,
  currentLevel = 0
) {
  try {
    // Build hierarchical tree structure
    const buildTree = async (parentId, currentLevel) => {
      if (maxDepth !== null && currentLevel >= maxDepth) {
        return [];
      }

      const categories = await this.find({
        parent: parentId,
        isActive: true,
      }).sort({ sortOrder: 1, name: 1 }).lean();

      const tree = [];
      for (let category of categories) {
        const children = await buildTree(category._id, currentLevel + 1);
        tree.push({
          ...category,
          children,
        });
      }

      return tree;
    };

    return await buildTree(parentId, currentLevel);
  } catch (error) {
    console.error("Error building tree:", error);
    // Fallback to flat structure
    const query = { isActive: true };
    if (parentId) query.parent = parentId;
    
    return await this.find(query)
      .sort({ level: 1, sortOrder: 1, name: 1 })
      .lean();
  }
};

categorySchema.statics.getRootCategories = function () {
  return this.find({ parent: null, isActive: true }).sort({
    sortOrder: 1,
    name: 1,
  });
};

categorySchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug, isActive: true });
};

categorySchema.statics.searchCategories = function (
  searchTerm,
  limit = 10,
) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
        ],
      },
    ],
  })
    .limit(limit)
    .sort({ level: 1, name: 1 });
};

categorySchema.statics.updateProductCounts = async function () {
  try {
    const Product = this.db.model("Producto");

    const pipeline = [
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ];

    const productCounts = await Product.aggregate(pipeline);

    // Reset all counts to 0
    await this.updateMany({}, { productCount: 0 });

    // Update counts for categories with products
    for (let item of productCounts) {
      if (item._id) {
        await this.findByIdAndUpdate(item._id, { productCount: item.count });
      }
    }
  } catch (error) {
    console.error("Error updating product counts:", error);
    throw error;
  }
};

// Virtual fields and transforms
categorySchema.virtual("breadcrumb").get(function () {
  if (!this.path) return [this._id];
  return this.path.split(",").concat([this._id]);
});

categorySchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  },
});

categorySchema.set("toObject", { virtuals: true });

module.exports = categorySchema;
