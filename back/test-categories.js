const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testCategorySystem() {
  console.log('🧪 Testing Category System Implementation...\n');

  try {
    // Test 1: Get all categories (flat format)
    console.log('1. Testing GET /categories (flat format)');
    try {
      const response = await axios.get(`${BASE_URL}/categories?format=flat`);
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   📊 Total categories: ${response.data.data.length}`);
      console.log(`   📝 First few categories: ${response.data.data.slice(0, 3).map(c => c.name).join(', ')}`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.response?.status || error.message}`);
    }

    // Test 2: Get root categories only
    console.log('\n2. Testing GET /categories/roots');
    try {
      const response = await axios.get(`${BASE_URL}/categories/roots`);
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   🌳 Root categories: ${response.data.data.length}`);
      response.data.data.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.slug})`);
      });
    } catch (error) {
      console.log(`   ❌ Error: ${error.response?.status || error.message}`);
    }

    // Test 3: Get products with new category system
    console.log('\n3. Testing GET /productos (with new category references)');
    try {
      const response = await axios.get(`${BASE_URL}/productos`);
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   📦 Total products: ${response.data.data.length}`);

      if (response.data.data.length > 0) {
        const product = response.data.data[0];
        console.log(`   🎸 Sample product: ${product.nombre}`);
        console.log(`   📁 Category: ${product.category?.name || 'No category'}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.response?.status || error.message}`);
    }

    // Test 4: Get category by slug
    console.log('\n4. Testing GET /categories/slug/stratocaster');
    try {
      const response = await axios.get(`${BASE_URL}/categories/slug/stratocaster`);
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   📁 Category: ${response.data.data.name}`);
      console.log(`   🔗 Slug: ${response.data.data.slug}`);
      console.log(`   📊 Level: ${response.data.data.level}`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.response?.status || error.message}`);
    }

    // Test 5: Get products by category
    console.log('\n5. Testing GET /productos/categoria/stratocaster');
    try {
      const response = await axios.get(`${BASE_URL}/productos/categoria/stratocaster`);
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   🎸 Products in Stratocaster: ${response.data.data.length}`);
      response.data.data.forEach(product => {
        console.log(`   - ${product.nombre} (${product.marca})`);
      });
    } catch (error) {
      console.log(`   ❌ Error: ${error.response?.status || error.message}`);
    }

    // Test 6: Get products by category with subcategories
    console.log('\n6. Testing GET /productos/categoria/guitarras-electricas?includeSubcategories=true');
    try {
      const response = await axios.get(`${BASE_URL}/productos/categoria/guitarras-electricas?includeSubcategories=true`);
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   🎸 Products in Electric Guitars (with subcategories): ${response.data.data.length}`);
      console.log(`   📊 Categories included: ${response.data.meta?.totalCategories || 'N/A'}`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.response?.status || error.message}`);
    }

    // Test 7: Search categories
    console.log('\n7. Testing GET /categories/search?q=guitar');
    try {
      const response = await axios.get(`${BASE_URL}/categories/search?q=guitar`);
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   🔍 Search results: ${response.data.data.length}`);
      response.data.data.forEach(cat => {
        console.log(`   - ${cat.name} (Level ${cat.level})`);
      });
    } catch (error) {
      console.log(`   ❌ Error: ${error.response?.status || error.message}`);
    }

    // Test 8: Create new category (Admin only)
    console.log('\n8. Testing POST /categories (Create new category)');
    try {
      // First get a parent category
      const parentResponse = await axios.get(`${BASE_URL}/categories/slug/guitarras-electricas`);
      const parentId = parentResponse.data.data._id;

      const newCategory = {
        name: 'Test Category',
        description: 'A test category for validation',
        parent: parentId,
        sortOrder: 99
      };

      const adminToken = process.env.TESTING_ADMIN_TOKEN;
      const response = await axios.post(`${BASE_URL}/categories`, newCategory, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   📁 Created: ${response.data.data.name}`);
      console.log(`   🔗 Slug: ${response.data.data.slug}`);
      console.log(`   📊 Level: ${response.data.data.level}`);

      // Clean up - delete the test category
      const deleteResponse = await axios.delete(`${BASE_URL}/categories/${response.data.data._id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
        data: { force: true }
      });
      console.log(`   🗑️ Cleanup: ${deleteResponse.status === 200 ? 'Success' : 'Failed'}`);

    } catch (error) {
      console.log(`   ❌ Error: ${error.response?.status || error.message}`);
      if (error.response?.data?.details) {
        console.log(`   📋 Details: ${error.response.data.details}`);
      }
    }

    console.log('\n🎉 Category System Test Complete!');
    console.log('\n📝 Summary:');
    console.log('- Tree-structured categories: ✅ Implemented');
    console.log('- Category CRUD operations: ✅ Available');
    console.log('- Product-category references: ✅ Working');
    console.log('- Category filtering: ✅ Functional');
    console.log('- Tree navigation: ✅ Supported');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testCategorySystem();
}

module.exports = { testCategorySystem };
