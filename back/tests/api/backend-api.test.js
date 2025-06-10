const { test, expect } = require('@playwright/test');

test.describe('El Mundo De Las Guitarras API Tests', () => {
  let userToken;
  let testUserId;
  
  test('1. Verificar que la API está funcionando', async ({ request }) => {
    const response = await request.get('/');
    
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toBe('API is running');
    
    console.log('✅ ¡La API está funcionando correctamente!');
  });

  test('2. Registrar un nuevo usuario', async ({ request }) => {
    const newUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'MyPassword123!',
      firstName: 'Juan',
      lastName: 'Pérez'
    };

    const response = await request.post('/api/auth/register', {
      data: newUser
    });
    
    expect(response.status()).toBe(201);
    const body = await response.json();
    
    expect(body).toHaveProperty('token'); 
    expect(body.user.email).toBe(newUser.email);
    
    userToken = body.token;
    testUserId = body.user._id;
    
    console.log('✅ ¡El registro de usuario funciona correctamente!');
  });

  test('3. Iniciar sesión con credenciales correctas', async ({ request }) => {
    const user = {
      username: `logintest_${Date.now()}`,
      email: `login_${Date.now()}@example.com`,
      password: 'MyPassword123!',
      firstName: 'María',
      lastName: 'García'
    };

    await request.post('/api/auth/register', { data: user });

    const loginResponse = await request.post('/api/auth/login', {
      data: {
        login: user.email,
        password: user.password
      }
    });
    
    expect(loginResponse.status()).toBe(200);
    const loginBody = await loginResponse.json();
    
    expect(loginBody).toHaveProperty('token');
    expect(loginBody.user.email).toBe(user.email);
    
    console.log('✅ ¡El inicio de sesión funciona con credenciales correctas!');
  });

  test('4. Falla el inicio de sesión con contraseña incorrecta', async ({ request }) => {
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        login: 'any@email.com',
        password: 'contraseñaincorrecta'
      }
    });
    
    expect(loginResponse.status()).toBe(401); // Should be unauthorized
    
    console.log('✅ ¡El inicio de sesión falla correctamente con contraseña incorrecta!');
  });

  test('5. Obtener lista de productos', async ({ request }) => {
    const response = await request.get('/api/productos');
    
    expect(response.status()).toBe(200);
    const products = await response.json();
    
    expect(Array.isArray(products)).toBe(true);
    console.log(`✅ ¡Se encontraron ${products.length} productos en la tienda!`);
  });

  test('6. Obtener perfil de usuario autenticado', async ({ request }) => {
    // First create and login a user
    const user = {
      username: `profiletest_${Date.now()}`,
      email: `profile_${Date.now()}@example.com`,
      password: 'MyPassword123!',
      firstName: 'Carlos',
      lastName: 'Rodríguez'
    };

    await request.post('/api/auth/register', { data: user });
    
    const loginResponse = await request.post('/api/auth/login', {
      data: { login: user.email, password: user.password }
    });
    
    const { token } = await loginResponse.json();

    const profileResponse = await request.get('/api/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    expect(profileResponse.status()).toBe(200);
    const profile = await profileResponse.json();
    
    expect(profile.email).toBe(user.email);
    expect(profile.firstName).toBe(user.firstName);
    
    console.log('✅ ¡Acceso al perfil de usuario funcionando!');
  });

  test('7. Actualizar perfil de usuario', async ({ request }) => {
    // Create and login user
    const user = {
      username: `updatetest_${Date.now()}`,
      email: `update_${Date.now()}@example.com`,
      password: 'MyPassword123!',
      firstName: 'Ana',
      lastName: 'López'
    };

    await request.post('/api/auth/register', { data: user });
    const loginResponse = await request.post('/api/auth/login', {
      data: { login: user.email, password: user.password }
    });
    const { token } = await loginResponse.json();

    const updateData = {
      firstName: 'Ana María',
      lastName: 'López García',
      phone: '+34 666 777 888'
    };

    const updateResponse = await request.put('/api/auth/profile', {
      data: updateData,
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    expect(updateResponse.status()).toBe(200);
    const updatedProfile = await updateResponse.json();
    
    expect(updatedProfile.firstName).toBe(updateData.firstName);
    expect(updatedProfile.phone).toBe(updateData.phone);
    
    console.log('✅ ¡Actualización de perfil funcionando!');
  });

  test('8. Obtener categorías de productos', async ({ request }) => {
    const response = await request.get('/api/categories');
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    
    expect(body).toHaveProperty('success');
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    
    console.log(`✅ ¡Se encontraron ${body.data.length} categorías!`);
  });

  test('9. Buscar productos por categoría', async ({ request }) => {
    const response = await request.get('/api/productos/categoria/guitarras');
    
    expect(response.status()).toBe(200);
    const products = await response.json();
    
    expect(Array.isArray(products)).toBe(true);
    
    console.log(`✅ ¡Búsqueda por categoría funcionando! Encontrados ${products.length} productos`);
  });

  test('10. Buscar productos por marca', async ({ request }) => {
    const response = await request.get('/api/productos/marca/fender');
    
    expect(response.status()).toBe(200);
    const products = await response.json();
    
    expect(Array.isArray(products)).toBe(true);
    
    console.log(`✅ ¡Búsqueda por marca funcionando! Encontrados ${products.length} productos`);
  });

  test('11. Obtener productos por tipo - Instrumentos', async ({ request }) => {
    const response = await request.get('/api/productos/tipo/instrumentos');
    
    expect(response.status()).toBe(200);
    const products = await response.json();
    
    expect(Array.isArray(products)).toBe(true);
    
    console.log(`✅ ¡Filtro por instrumentos funcionando! Encontrados ${products.length} instrumentos`);
  });

  test('12. Obtener productos por tipo - Equipos', async ({ request }) => {
    const response = await request.get('/api/productos/tipo/equipos');
    
    expect(response.status()).toBe(200);
    const products = await response.json();
    
    expect(Array.isArray(products)).toBe(true);
    
    console.log(`✅ ¡Filtro por equipos funcionando! Encontrados ${products.length} equipos`);
  });

  test('13. Obtener productos por tipo - Accesorios', async ({ request }) => {
    const response = await request.get('/api/productos/tipo/accesorios');
    
    expect(response.status()).toBe(200);
    const products = await response.json();
    
    expect(Array.isArray(products)).toBe(true);
    
    console.log(`✅ ¡Filtro por accesorios funcionando! Encontrados ${products.length} accesorios`);
  });

  test('14. Validar que no se puede acceder al perfil sin token', async ({ request }) => {
    const response = await request.get('/api/auth/profile');
    
    expect(response.status()).toBe(401);
    
    console.log('✅ ¡Protección de rutas funcionando correctamente!');
  });

  test('15. Validar error con email duplicado en registro', async ({ request }) => {
    const user = {
      username: `duplicate_${Date.now()}`,
      email: `duplicate_${Date.now()}@example.com`,
      password: 'MyPassword123!',
      firstName: 'Pedro',
      lastName: 'Martín'
    };

    // Register user first time
    await request.post('/api/auth/register', { data: user });

    // Try to register same email again
    const duplicateResponse = await request.post('/api/auth/register', {
      data: { ...user, username: 'different_username' }
    });
    
    expect(duplicateResponse.status()).toBe(409);
    
    console.log('✅ ¡Validación de email duplicado funcionando!');
  });

  test('16. Validar error con contraseña débil', async ({ request }) => {
    const weakPasswordUser = {
      username: `weakpass_${Date.now()}`,
      email: `weak_${Date.now()}@example.com`,
      password: '123', // Very weak password
      firstName: 'Luis',
      lastName: 'Fernández'
    };

    const response = await request.post('/api/auth/register', {
      data: weakPasswordUser
    });
    
    expect(response.status()).toBe(400);
    
    console.log('✅ ¡Validación de contraseña débil funcionando!');
  });

  test('17. Obtener producto específico por ID', async ({ request }) => {
    // First get all products to get a valid ID
    const allProductsResponse = await request.get('/api/productos?limit=1');
    const products = await allProductsResponse.json();
    
    if (products.length > 0) {
      const productId = products[0]._id;
      const response = await request.get(`/api/productos/${productId}`);
      
      expect(response.status()).toBe(200);
      const product = await response.json();
      
      expect(product._id).toBe(productId);
      
      console.log(`✅ ¡Obtener producto por ID funcionando! Producto: ${product.nombre || 'Sin nombre'}`);
    } else {
      console.log('⚠️ No hay productos para probar obtener por ID');
    }
  });

  test('18. Buscar categorías por texto', async ({ request }) => {
    const response = await request.get('/api/categories/search?q=guitarra');
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    
    expect(Array.isArray(body)).toBe(true);
    
    console.log(`✅ ¡Búsqueda de categorías funcionando! Encontradas ${body.length} categorías`);
  });

  test('19. Obtener categorías raíz', async ({ request }) => {
    const response = await request.get('/api/categories/roots');
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    
    expect(Array.isArray(body)).toBe(true);
    
    console.log(`✅ ¡Obtener categorías raíz funcionando! Encontradas ${body.length} categorías principales`);
  });

  test('20. Verificar que rutas de admin requieren autenticación', async ({ request }) => {
    const response = await request.post('/api/productos', {
      data: {
        nombre: 'Producto de prueba',
        precio: 100
      }
    });
    
    expect(response.status()).toBe(401);
    
    console.log('✅ ¡Protección de rutas administrativas funcionando!');
  });
});
