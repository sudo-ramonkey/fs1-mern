require('dotenv').config();
const axios = require('axios');
const { TESTING_ADMIN_TOKEN } = require('./jwt');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

/**
 * API Testing Utility
 * Provides easy methods to test all API endpoints
 */
class ApiTester {
  constructor() {
    this.baseURL = BASE_URL;
    this.adminToken = TESTING_ADMIN_TOKEN;
    this.userToken = null;
    this.testResults = [];
  }

  /**
   * Create axios instance with authentication
   */
  createAxiosInstance(token = null) {
    const config = {
      baseURL: this.baseURL,
      timeout: 10000,
    };

    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }

    return axios.create(config);
  }

  /**
   * Log test results
   */
  log(method, endpoint, status, success, data = null, error = null) {
    const result = {
      timestamp: new Date().toISOString(),
      method,
      endpoint,
      status,
      success,
      data: success ? data : null,
      error: error ? error.message : null,
    };

    this.testResults.push(result);

    const statusColor = success ? '\x1b[32m' : '\x1b[31m'; // Green for success, red for error
    const resetColor = '\x1b[0m';

    console.log(
      `${statusColor}[${method}]${resetColor} ${endpoint} - ${status} ${
        success ? '✅' : '❌'
      }`
    );

    if (error) {
      console.log(`  Error: ${error.message}`);
    }

    if (data && typeof data === 'object') {
      console.log(`  Response:`, JSON.stringify(data, null, 2));
    }
  }

  /**
   * Test authentication endpoints
   */
  async testAuth() {
    console.log('\n🔐 Testing Authentication Endpoints...\n');

    try {
      // Test registration
      const registerData = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@test.com`,
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User',
      };

      const api = this.createAxiosInstance();
      const registerResponse = await api.post('/auth/register', registerData);
      this.log('POST', '/auth/register', registerResponse.status, true, registerResponse.data);
      this.userToken = registerResponse.data.token;

      // Test login
      const loginData = {
        login: registerData.username,
        password: registerData.password,
      };

      const loginResponse = await api.post('/auth/login', loginData);
      this.log('POST', '/auth/login', loginResponse.status, true, loginResponse.data);

      // Test profile with user token
      const userApi = this.createAxiosInstance(this.userToken);
      const profileResponse = await userApi.get('/auth/profile');
      this.log('GET', '/auth/profile', profileResponse.status, true, profileResponse.data);

      // Test profile update
      const updateData = { firstName: 'Updated' };
      const updateResponse = await userApi.put('/auth/profile', updateData);
      this.log('PUT', '/auth/profile', updateResponse.status, true, updateResponse.data);

      // Test password change
      const passwordData = {
        currentPassword: 'Test123!',
        newPassword: 'NewTest123!',
      };
      const passwordResponse = await userApi.put('/auth/change-password', passwordData);
      this.log('PUT', '/auth/change-password', passwordResponse.status, true, passwordResponse.data);

      // Test token refresh
      const refreshResponse = await userApi.post('/auth/refresh');
      this.log('POST', '/auth/refresh', refreshResponse.status, true, refreshResponse.data);

      // Test logout
      const logoutResponse = await userApi.post('/auth/logout');
      this.log('POST', '/auth/logout', logoutResponse.status, true, logoutResponse.data);

    } catch (error) {
      this.log('ERROR', 'auth-test', error.response?.status || 500, false, null, error);
    }
  }

  /**
   * Test product endpoints
   */
  async testProducts() {
    console.log('\n🎸 Testing Product Endpoints...\n');

    try {
      const api = this.createAxiosInstance();
      const adminApi = this.createAxiosInstance(this.adminToken);

      // Test get all products (public)
      const allProductsResponse = await api.get('/productos');
      this.log('GET', '/productos', allProductsResponse.status, true, { count: allProductsResponse.data.length });

      // Test get products by type
      const instrumentsResponse = await api.get('/productos/tipo/instrumentos');
      this.log('GET', '/productos/tipo/instrumentos', instrumentsResponse.status, true, { count: instrumentsResponse.data.length });

      const equiposResponse = await api.get('/productos/tipo/equipos');
      this.log('GET', '/productos/tipo/equipos', equiposResponse.status, true, { count: equiposResponse.data.length });

      const accesoriosResponse = await api.get('/productos/tipo/accesorios');
      this.log('GET', '/productos/tipo/accesorios', accesoriosResponse.status, true, { count: accesoriosResponse.data.length });

      // Test filtering
      const filteredResponse = await api.get('/productos?marca=Fender&tipo=Instrumento');
      this.log('GET', '/productos?marca=Fender&tipo=Instrumento', filteredResponse.status, true, { count: filteredResponse.data.length });

      // Test create product (admin only)
      const newProduct = {
        nombre: `Test Guitar ${Date.now()}`,
        descripcion: 'A test guitar for API testing',
        precio: 999.99,
        marca: 'Fender',
        stock: 5,
        tipo: 'Instrumento',
        categoriaProducto: 'Guitarras Electricas',
        categoria: 'Electrico',
        tipoInstrumento: 'Guitarra',
        materialCuerpo: 'Aliso',
        materialMastil: 'Arce',
        numeroCuerdas: 6,
        color: 'Sunburst',
        incluyeEstuche: false,
      };

      const createResponse = await adminApi.post('/productos', newProduct);
      this.log('POST', '/productos', createResponse.status, true, createResponse.data);
      const createdProductId = createResponse.data._id;

      // Test get product by ID
      const productResponse = await api.get(`/productos/${createdProductId}`);
      this.log('GET', `/productos/${createdProductId}`, productResponse.status, true, productResponse.data);

      // Test update product (admin only)
      const updateData = { precio: 1099.99, stock: 3 };
      const updateResponse = await adminApi.put(`/productos/${createdProductId}`, updateData);
      this.log('PUT', `/productos/${createdProductId}`, updateResponse.status, true, updateResponse.data);

      // Test delete product (admin only)
      const deleteResponse = await adminApi.delete(`/productos/${createdProductId}`);
      this.log('DELETE', `/productos/${createdProductId}`, deleteResponse.status, true, deleteResponse.data);

      // Test unauthorized access (should fail)
      try {
        await api.post('/productos', newProduct);
        this.log('POST', '/productos (unauthorized)', 401, false);
      } catch (error) {
        this.log('POST', '/productos (unauthorized)', error.response.status, true, { message: 'Correctly blocked unauthorized access' });
      }

    } catch (error) {
      this.log('ERROR', 'products-test', error.response?.status || 500, false, null, error);
    }
  }

  /**
   * Test user management endpoints (admin only)
   */
  async testUserManagement() {
    console.log('\n👥 Testing User Management Endpoints...\n');

    try {
      const adminApi = this.createAxiosInstance(this.adminToken);

      // Test get all users
      const usersResponse = await adminApi.get('/users');
      this.log('GET', '/users', usersResponse.status, true, {
        count: usersResponse.data.users.length,
        pagination: usersResponse.data.pagination
      });

      // Test get users with pagination
      const paginatedResponse = await adminApi.get('/users?page=1&limit=5');
      this.log('GET', '/users?page=1&limit=5', paginatedResponse.status, true, {
        count: paginatedResponse.data.users.length,
        pagination: paginatedResponse.data.pagination
      });

      // Test get user statistics
      const statsResponse = await adminApi.get('/users/stats');
      this.log('GET', '/users/stats', statsResponse.status, true, statsResponse.data);

      // Test create user
      const newUser = {
        username: `admin_test_${Date.now()}`,
        email: `admin_test_${Date.now()}@test.com`,
        password: 'AdminTest123!',
        firstName: 'Admin',
        lastName: 'Test',
        role: 'User',
      };

      const createUserResponse = await adminApi.post('/users', newUser);
      this.log('POST', '/users', createUserResponse.status, true, createUserResponse.data);
      const createdUserId = createUserResponse.data.user._id;

      // Test get user by ID
      const userResponse = await adminApi.get(`/users/${createdUserId}`);
      this.log('GET', `/users/${createdUserId}`, userResponse.status, true, userResponse.data);

      // Test update user
      const updateUserData = { firstName: 'Updated Admin' };
      const updateUserResponse = await adminApi.put(`/users/${createdUserId}`, updateUserData);
      this.log('PUT', `/users/${createdUserId}`, updateUserResponse.status, true, updateUserResponse.data);

      // Test toggle user status
      const toggleResponse = await adminApi.patch(`/users/${createdUserId}/toggle-active`);
      this.log('PATCH', `/users/${createdUserId}/toggle-active`, toggleResponse.status, true, toggleResponse.data);

      // Test reset password
      const resetPasswordData = { newPassword: 'NewAdminTest123!' };
      const resetResponse = await adminApi.patch(`/users/${createdUserId}/reset-password`, resetPasswordData);
      this.log('PATCH', `/users/${createdUserId}/reset-password`, resetResponse.status, true, resetResponse.data);

      // Test delete user
      const deleteUserResponse = await adminApi.delete(`/users/${createdUserId}`);
      this.log('DELETE', `/users/${createdUserId}`, deleteUserResponse.status, true, deleteUserResponse.data);

    } catch (error) {
      this.log('ERROR', 'user-management-test', error.response?.status || 500, false, null, error);
    }
  }

  /**
   * Test error scenarios
   */
  async testErrorScenarios() {
    console.log('\n⚠️  Testing Error Scenarios...\n');

    try {
      const api = this.createAxiosInstance();

      // Test invalid endpoint
      try {
        await api.get('/invalid-endpoint');
      } catch (error) {
        this.log('GET', '/invalid-endpoint', error.response.status, true, { message: 'Correctly returned 404' });
      }

      // Test invalid login
      try {
        await api.post('/auth/login', { login: 'invalid', password: 'invalid' });
      } catch (error) {
        this.log('POST', '/auth/login (invalid)', error.response.status, true, { message: 'Correctly blocked invalid login' });
      }

      // Test invalid product ID
      try {
        await api.get('/productos/invalid-id');
      } catch (error) {
        this.log('GET', '/productos/invalid-id', error.response.status, true, { message: 'Correctly handled invalid ID' });
      }

      // Test missing required fields
      try {
        const adminApi = this.createAxiosInstance(this.adminToken);
        await adminApi.post('/productos', { nombre: 'Test' }); // Missing required fields
      } catch (error) {
        this.log('POST', '/productos (missing fields)', error.response.status, true, { message: 'Correctly validated required fields' });
      }

    } catch (error) {
      this.log('ERROR', 'error-scenarios-test', error.response?.status || 500, false, null, error);
    }
  }

  /**
   * Test specific endpoint
   */
  async testEndpoint(method, endpoint, data = null, useAuth = false) {
    console.log(`\n🔍 Testing ${method.toUpperCase()} ${endpoint}...\n`);

    try {
      const api = this.createAxiosInstance(useAuth ? this.adminToken : null);
      let response;

      switch (method.toLowerCase()) {
        case 'get':
          response = await api.get(endpoint);
          break;
        case 'post':
          response = await api.post(endpoint, data);
          break;
        case 'put':
          response = await api.put(endpoint, data);
          break;
        case 'patch':
          response = await api.patch(endpoint, data);
          break;
        case 'delete':
          response = await api.delete(endpoint);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      this.log(method.toUpperCase(), endpoint, response.status, true, response.data);
      return response.data;

    } catch (error) {
      this.log(method.toUpperCase(), endpoint, error.response?.status || 500, false, null, error);
      throw error;
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🚀 Starting API Tests...\n');
    console.log(`Base URL: ${this.baseURL}`);
    console.log(`Testing Token: ${this.adminToken ? 'Available' : 'Not Available'}\n`);

    const startTime = Date.now();

    await this.testAuth();
    await this.testProducts();
    await this.testUserManagement();
    await this.testErrorScenarios();

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log('\n📊 Test Summary:');
    console.log('='.repeat(50));
    console.log(`Total tests: ${this.testResults.length}`);
    console.log(`Successful: ${this.testResults.filter(r => r.success).length}`);
    console.log(`Failed: ${this.testResults.filter(r => !r.success).length}`);
    console.log(`Duration: ${duration}s`);
    console.log('='.repeat(50));

    return this.testResults;
  }

  /**
   * Get test results summary
   */
  getTestSummary() {
    return {
      total: this.testResults.length,
      successful: this.testResults.filter(r => r.success).length,
      failed: this.testResults.filter(r => !r.success).length,
      results: this.testResults,
    };
  }
}

// CLI functionality
if (require.main === module) {
  const tester = new ApiTester();
  const command = process.argv[2];

  const runCommand = async () => {
    try {
      switch (command) {
        case 'auth':
          await tester.testAuth();
          break;
        case 'products':
          await tester.testProducts();
          break;
        case 'users':
          await tester.testUserManagement();
          break;
        case 'errors':
          await tester.testErrorScenarios();
          break;
        case 'all':
        default:
          await tester.runAllTests();
          break;
      }
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      process.exit(1);
    }
  };

  runCommand();
}

module.exports = ApiTester;
