# Test info

- Name: El Mundo De Las Guitarras API Tests >> 19. Obtener categorías raíz
- Location: /home/ramonkey/Developer/fs1-mern/back/tests/api/backend-api.test.js:306:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
    at /home/ramonkey/Developer/fs1-mern/back/tests/api/backend-api.test.js:312:33
```

# Test source

```ts
  212 |     
  213 |     console.log(`✅ ¡Filtro por equipos funcionando! Encontrados ${products.length} equipos`);
  214 |   });
  215 |
  216 |   test('13. Obtener productos por tipo - Accesorios', async ({ request }) => {
  217 |     const response = await request.get('/api/productos/tipo/accesorios');
  218 |     
  219 |     expect(response.status()).toBe(200);
  220 |     const products = await response.json();
  221 |     
  222 |     expect(Array.isArray(products)).toBe(true);
  223 |     
  224 |     console.log(`✅ ¡Filtro por accesorios funcionando! Encontrados ${products.length} accesorios`);
  225 |   });
  226 |
  227 |   test('14. Validar que no se puede acceder al perfil sin token', async ({ request }) => {
  228 |     const response = await request.get('/api/auth/profile');
  229 |     
  230 |     expect(response.status()).toBe(401);
  231 |     
  232 |     console.log('✅ ¡Protección de rutas funcionando correctamente!');
  233 |   });
  234 |
  235 |   test('15. Validar error con email duplicado en registro', async ({ request }) => {
  236 |     const user = {
  237 |       username: `duplicate_${Date.now()}`,
  238 |       email: `duplicate_${Date.now()}@example.com`,
  239 |       password: 'MyPassword123!',
  240 |       firstName: 'Pedro',
  241 |       lastName: 'Martín'
  242 |     };
  243 |
  244 |     // Register user first time
  245 |     await request.post('/api/auth/register', { data: user });
  246 |
  247 |     // Try to register same email again
  248 |     const duplicateResponse = await request.post('/api/auth/register', {
  249 |       data: { ...user, username: 'different_username' }
  250 |     });
  251 |     
  252 |     expect(duplicateResponse.status()).toBe(409);
  253 |     
  254 |     console.log('✅ ¡Validación de email duplicado funcionando!');
  255 |   });
  256 |
  257 |   test('16. Validar error con contraseña débil', async ({ request }) => {
  258 |     const weakPasswordUser = {
  259 |       username: `weakpass_${Date.now()}`,
  260 |       email: `weak_${Date.now()}@example.com`,
  261 |       password: '123', // Very weak password
  262 |       firstName: 'Luis',
  263 |       lastName: 'Fernández'
  264 |     };
  265 |
  266 |     const response = await request.post('/api/auth/register', {
  267 |       data: weakPasswordUser
  268 |     });
  269 |     
  270 |     expect(response.status()).toBe(400);
  271 |     
  272 |     console.log('✅ ¡Validación de contraseña débil funcionando!');
  273 |   });
  274 |
  275 |   test('17. Obtener producto específico por ID', async ({ request }) => {
  276 |     // First get all products to get a valid ID
  277 |     const allProductsResponse = await request.get('/api/productos?limit=1');
  278 |     const products = await allProductsResponse.json();
  279 |     
  280 |     if (products.length > 0) {
  281 |       const productId = products[0]._id;
  282 |       const response = await request.get(`/api/productos/${productId}`);
  283 |       
  284 |       expect(response.status()).toBe(200);
  285 |       const product = await response.json();
  286 |       
  287 |       expect(product._id).toBe(productId);
  288 |       
  289 |       console.log(`✅ ¡Obtener producto por ID funcionando! Producto: ${product.nombre || 'Sin nombre'}`);
  290 |     } else {
  291 |       console.log('⚠️ No hay productos para probar obtener por ID');
  292 |     }
  293 |   });
  294 |
  295 |   test('18. Buscar categorías por texto', async ({ request }) => {
  296 |     const response = await request.get('/api/categories/search?q=guitarra');
  297 |     
  298 |     expect(response.status()).toBe(200);
  299 |     const body = await response.json();
  300 |     
  301 |     expect(Array.isArray(body)).toBe(true);
  302 |     
  303 |     console.log(`✅ ¡Búsqueda de categorías funcionando! Encontradas ${body.length} categorías`);
  304 |   });
  305 |
  306 |   test('19. Obtener categorías raíz', async ({ request }) => {
  307 |     const response = await request.get('/api/categories/roots');
  308 |     
  309 |     expect(response.status()).toBe(200);
  310 |     const body = await response.json();
  311 |     
> 312 |     expect(Array.isArray(body)).toBe(true);
      |                                 ^ Error: expect(received).toBe(expected) // Object.is equality
  313 |     
  314 |     console.log(`✅ ¡Obtener categorías raíz funcionando! Encontradas ${body.length} categorías principales`);
  315 |   });
  316 |
  317 |   test('20. Verificar que rutas de admin requieren autenticación', async ({ request }) => {
  318 |     const response = await request.post('/api/productos', {
  319 |       data: {
  320 |         nombre: 'Producto de prueba',
  321 |         precio: 100
  322 |       }
  323 |     });
  324 |     
  325 |     expect(response.status()).toBe(401);
  326 |     
  327 |     console.log('✅ ¡Protección de rutas administrativas funcionando!');
  328 |   });
  329 | });
  330 |
```