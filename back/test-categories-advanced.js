require("dotenv").config();
const mongoose = require("mongoose");
const { Category } = require("./src/models");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/fs1-mern";

const testCategoryOperations = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    console.log("\n=== TESTING CATEGORY OPERATIONS ===\n");

    // Test 1: Get tree structure
    console.log("1. Testing tree structure:");
    const tree = await Category.getTree();
    console.log(`Found ${tree.length} root categories`);
    
    if (tree.length > 0) {
      console.log("Sample tree structure:");
      tree.forEach(cat => {
        console.log(`- ${cat.name} (level ${cat.level})`);
        if (cat.children && cat.children.length > 0) {
          cat.children.forEach(child => {
            console.log(`  - ${child.name} (level ${child.level})`);
            if (child.children && child.children.length > 0) {
              child.children.forEach(grandchild => {
                console.log(`    - ${grandchild.name} (level ${grandchild.level})`);
              });
            }
          });
        }
      });
    }

    // Test 2: Create new category
    console.log("\n2. Testing category creation:");
    const newCategory = await Category.create({
      name: "Test Category",
      description: "A test category",
      parent: null,
      isActive: true,
      sortOrder: 999
    });
    console.log(`Created category: ${newCategory.name} with ID: ${newCategory._id}`);
    console.log(`Level: ${newCategory.level}, Path: ${newCategory.path}`);

    // Test 3: Create subcategory
    console.log("\n3. Testing subcategory creation:");
    const subCategory = await Category.create({
      name: "Test Subcategory",
      description: "A test subcategory",
      parent: newCategory._id,
      isActive: true,
      sortOrder: 1
    });
    console.log(`Created subcategory: ${subCategory.name} with ID: ${subCategory._id}`);
    console.log(`Level: ${subCategory.level}, Path: ${subCategory.path}`);

    // Test 4: Get ancestors
    console.log("\n4. Testing ancestor retrieval:");
    const ancestors = await subCategory.getAncestors();
    console.log(`Subcategory has ${ancestors.length} ancestors:`);
    ancestors.forEach(ancestor => {
      console.log(`- ${ancestor.name} (level ${ancestor.level})`);
    });

    // Test 5: Get descendants
    console.log("\n5. Testing descendant retrieval:");
    const descendants = await newCategory.getDescendants();
    console.log(`Category has ${descendants.length} descendants:`);
    descendants.forEach(descendant => {
      console.log(`- ${descendant.name} (level ${descendant.level})`);
    });

    // Test 6: Get full path
    console.log("\n6. Testing full path:");
    const fullPath = await subCategory.getFullPath();
    console.log(`Full path: ${fullPath}`);

    // Test 7: Test breadcrumb virtual
    console.log("\n7. Testing breadcrumb virtual:");
    const breadcrumb = subCategory.breadcrumb;
    console.log(`Breadcrumb IDs: [${breadcrumb.join(', ')}]`);

    // Test 8: Move category
    console.log("\n8. Testing category move:");
    const instrumentos = await Category.findOne({ name: "Instrumentos" });
    if (instrumentos) {
      const canMove = await subCategory.canMoveTo(instrumentos._id);
      console.log(`Can move subcategory to Instrumentos: ${canMove}`);
      
      if (canMove) {
        subCategory.parent = instrumentos._id;
        await subCategory.save();
        console.log(`Moved subcategory to Instrumentos`);
        console.log(`New level: ${subCategory.level}, New path: ${subCategory.path}`);
      }
    }

    // Test 9: Search categories
    console.log("\n9. Testing category search:");
    const searchResults = await Category.searchCategories("guitar", 5);
    console.log(`Found ${searchResults.length} categories matching "guitar":`);
    searchResults.forEach(cat => {
      console.log(`- ${cat.name} (level ${cat.level})`);
    });

    // Test 10: Get flat structure
    console.log("\n10. Testing flat structure:");
    const flatCategories = await Category.find({ isActive: true })
      .sort({ level: 1, sortOrder: 1, name: 1 })
      .select('name level path parent')
      .lean();
    console.log(`Found ${flatCategories.length} categories in flat structure:`);
    flatCategories.slice(0, 10).forEach(cat => {
      console.log(`- ${cat.name} (level ${cat.level}) parent: ${cat.parent || 'null'}`);
    });

    // Cleanup test data
    console.log("\n11. Cleaning up test data:");
    await Category.findByIdAndDelete(subCategory._id);
    await Category.findByIdAndDelete(newCategory._id);
    console.log("Test categories deleted");

    console.log("\n=== ALL TESTS COMPLETED SUCCESSFULLY ===\n");

  } catch (error) {
    console.error("Error testing categories:", error);
    console.error("Stack trace:", error.stack);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run if called directly
if (require.main === module) {
  testCategoryOperations();
}

module.exports = testCategoryOperations;
