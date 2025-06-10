# Test info

- Name: El Mundo De Las Guitarras API Tests >> 6. Obtener perfil de usuario autenticado
- Location: /home/ramonkey/Developer/fs1-mern/back/tests/api/backend-api.test.js:92:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "profile_1749528954056@example.com"
Received: undefined
    at /home/ramonkey/Developer/fs1-mern/back/tests/api/backend-api.test.js:117:27
```

# Test source

```ts
   17 |   test('2. Registrar un nuevo usuario', async ({ request }) => {
   18 |     const newUser = {
   19 |       username: `testuser_${Date.now()}`,
   20 |       email: `test_${Date.now()}@example.com`,
   21 |       password: 'MyPassword123!',
   22 |       firstName: 'Juan',
   23 |       lastName: 'Pérez'
   24 |     };
   25 |
   26 |     const response = await request.post('/api/auth/register', {
   27 |       data: newUser
   28 |     });
   29 |     
   30 |     expect(response.status()).toBe(201);
   31 |     const body = await response.json();
   32 |     
   33 |     expect(body).toHaveProperty('token'); 
   34 |     expect(body.user.email).toBe(newUser.email);
   35 |     
   36 |     userToken = body.token;
   37 |     testUserId = body.user._id;
   38 |     
   39 |     console.log('✅ ¡El registro de usuario funciona correctamente!');
   40 |   });
   41 |
   42 |   test('3. Iniciar sesión con credenciales correctas', async ({ request }) => {
   43 |     const user = {
   44 |       username: `logintest_${Date.now()}`,
   45 |       email: `login_${Date.now()}@example.com`,
   46 |       password: 'MyPassword123!',
   47 |       firstName: 'María',
   48 |       lastName: 'García'
   49 |     };
   50 |
   51 |     await request.post('/api/auth/register', { data: user });
   52 |
   53 |     const loginResponse = await request.post('/api/auth/login', {
   54 |       data: {
   55 |         login: user.email,
   56 |         password: user.password
   57 |       }
   58 |     });
   59 |     
   60 |     expect(loginResponse.status()).toBe(200);
   61 |     const loginBody = await loginResponse.json();
   62 |     
   63 |     expect(loginBody).toHaveProperty('token');
   64 |     expect(loginBody.user.email).toBe(user.email);
   65 |     
   66 |     console.log('✅ ¡El inicio de sesión funciona con credenciales correctas!');
   67 |   });
   68 |
   69 |   test('4. Falla el inicio de sesión con contraseña incorrecta', async ({ request }) => {
   70 |     const loginResponse = await request.post('/api/auth/login', {
   71 |       data: {
   72 |         login: 'any@email.com',
   73 |         password: 'contraseñaincorrecta'
   74 |       }
   75 |     });
   76 |     
   77 |     expect(loginResponse.status()).toBe(401); // Should be unauthorized
   78 |     
   79 |     console.log('✅ ¡El inicio de sesión falla correctamente con contraseña incorrecta!');
   80 |   });
   81 |
   82 |   test('5. Obtener lista de productos', async ({ request }) => {
   83 |     const response = await request.get('/api/productos');
   84 |     
   85 |     expect(response.status()).toBe(200);
   86 |     const products = await response.json();
   87 |     
   88 |     expect(Array.isArray(products)).toBe(true);
   89 |     console.log(`✅ ¡Se encontraron ${products.length} productos en la tienda!`);
   90 |   });
   91 |
   92 |   test('6. Obtener perfil de usuario autenticado', async ({ request }) => {
   93 |     // First create and login a user
   94 |     const user = {
   95 |       username: `profiletest_${Date.now()}`,
   96 |       email: `profile_${Date.now()}@example.com`,
   97 |       password: 'MyPassword123!',
   98 |       firstName: 'Carlos',
   99 |       lastName: 'Rodríguez'
  100 |     };
  101 |
  102 |     await request.post('/api/auth/register', { data: user });
  103 |     
  104 |     const loginResponse = await request.post('/api/auth/login', {
  105 |       data: { login: user.email, password: user.password }
  106 |     });
  107 |     
  108 |     const { token } = await loginResponse.json();
  109 |
  110 |     const profileResponse = await request.get('/api/auth/profile', {
  111 |       headers: { 'Authorization': `Bearer ${token}` }
  112 |     });
  113 |     
  114 |     expect(profileResponse.status()).toBe(200);
  115 |     const profile = await profileResponse.json();
  116 |     
> 117 |     expect(profile.email).toBe(user.email);
      |                           ^ Error: expect(received).toBe(expected) // Object.is equality
  118 |     expect(profile.firstName).toBe(user.firstName);
  119 |     
  120 |     console.log('✅ ¡Acceso al perfil de usuario funcionando!');
  121 |   });
  122 |
  123 |   test('7. Actualizar perfil de usuario', async ({ request }) => {
  124 |     // Create and login user
  125 |     const user = {
  126 |       username: `updatetest_${Date.now()}`,
  127 |       email: `update_${Date.now()}@example.com`,
  128 |       password: 'MyPassword123!',
  129 |       firstName: 'Ana',
  130 |       lastName: 'López'
  131 |     };
  132 |
  133 |     await request.post('/api/auth/register', { data: user });
  134 |     const loginResponse = await request.post('/api/auth/login', {
  135 |       data: { login: user.email, password: user.password }
  136 |     });
  137 |     const { token } = await loginResponse.json();
  138 |
  139 |     const updateData = {
  140 |       firstName: 'Ana María',
  141 |       lastName: 'López García',
  142 |       phone: '+34 666 777 888'
  143 |     };
  144 |
  145 |     const updateResponse = await request.put('/api/auth/profile', {
  146 |       data: updateData,
  147 |       headers: { 'Authorization': `Bearer ${token}` }
  148 |     });
  149 |     
  150 |     expect(updateResponse.status()).toBe(200);
  151 |     const updatedProfile = await updateResponse.json();
  152 |     
  153 |     expect(updatedProfile.firstName).toBe(updateData.firstName);
  154 |     expect(updatedProfile.phone).toBe(updateData.phone);
  155 |     
  156 |     console.log('✅ ¡Actualización de perfil funcionando!');
  157 |   });
  158 |
  159 |   test('8. Obtener categorías de productos', async ({ request }) => {
  160 |     const response = await request.get('/api/categories');
  161 |     
  162 |     expect(response.status()).toBe(200);
  163 |     const body = await response.json();
  164 |     
  165 |     expect(body).toHaveProperty('success');
  166 |     expect(body.success).toBe(true);
  167 |     expect(Array.isArray(body.data)).toBe(true);
  168 |     
  169 |     console.log(`✅ ¡Se encontraron ${body.data.length} categorías!`);
  170 |   });
  171 |
  172 |   test('9. Buscar productos por categoría', async ({ request }) => {
  173 |     const response = await request.get('/api/productos/categoria/guitarras');
  174 |     
  175 |     expect(response.status()).toBe(200);
  176 |     const products = await response.json();
  177 |     
  178 |     expect(Array.isArray(products)).toBe(true);
  179 |     
  180 |     console.log(`✅ ¡Búsqueda por categoría funcionando! Encontrados ${products.length} productos`);
  181 |   });
  182 |
  183 |   test('10. Buscar productos por marca', async ({ request }) => {
  184 |     const response = await request.get('/api/productos/marca/fender');
  185 |     
  186 |     expect(response.status()).toBe(200);
  187 |     const products = await response.json();
  188 |     
  189 |     expect(Array.isArray(products)).toBe(true);
  190 |     
  191 |     console.log(`✅ ¡Búsqueda por marca funcionando! Encontrados ${products.length} productos`);
  192 |   });
  193 |
  194 |   test('11. Obtener productos por tipo - Instrumentos', async ({ request }) => {
  195 |     const response = await request.get('/api/productos/tipo/instrumentos');
  196 |     
  197 |     expect(response.status()).toBe(200);
  198 |     const products = await response.json();
  199 |     
  200 |     expect(Array.isArray(products)).toBe(true);
  201 |     
  202 |     console.log(`✅ ¡Filtro por instrumentos funcionando! Encontrados ${products.length} instrumentos`);
  203 |   });
  204 |
  205 |   test('12. Obtener productos por tipo - Equipos', async ({ request }) => {
  206 |     const response = await request.get('/api/productos/tipo/equipos');
  207 |     
  208 |     expect(response.status()).toBe(200);
  209 |     const products = await response.json();
  210 |     
  211 |     expect(Array.isArray(products)).toBe(true);
  212 |     
  213 |     console.log(`✅ ¡Filtro por equipos funcionando! Encontrados ${products.length} equipos`);
  214 |   });
  215 |
  216 |   test('13. Obtener productos por tipo - Accesorios', async ({ request }) => {
  217 |     const response = await request.get('/api/productos/tipo/accesorios');
```