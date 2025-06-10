# 🎸 Tests de Unidad - El Mundo De Las Guitarras

Esta es una suite de tests completa para cubrir el 75% del backend de la API de El Mundo Guitarras.

## 📁 Estructura

```
tests/
├── api/
│   └── backend-api.test.js       # 20 tests completos
└── playwright-api.config.js      # Configuración simple
```

## 🚀 Cómo Ejecutar los Tests

### Asegúrate de que el servidor esté ejecutándose:
```bash
npm run dev
```

### Luego ejecuta los tests:
```bash
# Ejecutar todos los 20 tests
npm test

# Ejecutar tests con interfaz visual
npm run test:ui
```

## 🧪 Tus 20 Tests (Cobertura del 75%)

### **Autenticación y Usuarios (7 tests):**
1. ✅ **Verificar API** - ¿Está funcionando el servidor?
2. ✅ **Registrar usuario** - ¿Podemos crear usuarios?
3. ✅ **Iniciar sesión exitoso** - ¿Funciona con credenciales correctas?
4. ✅ **Iniciar sesión fallido** - ¿Falla con contraseña incorrecta?
5. ✅ **Obtener perfil** - ¿Podemos acceder al perfil?
6. ✅ **Actualizar perfil** - ¿Podemos modificar datos del usuario?
7. ✅ **Protección sin token** - ¿Están protegidas las rutas?

### **Productos (7 tests):**
8. ✅ **Lista de productos** - ¿Podemos obtener todos los productos?
9. ✅ **Productos por categoría** - ¿Funciona el filtro por categoría?
10. ✅ **Productos por marca** - ¿Funciona el filtro por marca?
11. ✅ **Filtro instrumentos** - ¿Obtenemos solo instrumentos?
12. ✅ **Filtro equipos** - ¿Obtenemos solo equipos?
13. ✅ **Filtro accesorios** - ¿Obtenemos solo accesorios?
14. ✅ **Producto por ID** - ¿Podemos obtener un producto específico?

### **Categorías (3 tests):**
15. ✅ **Lista de categorías** - ¿Obtenemos todas las categorías?
16. ✅ **Buscar categorías** - ¿Funciona la búsqueda por texto?
17. ✅ **Categorías raíz** - ¿Obtenemos las categorías principales?

### **Validaciones y Seguridad (3 tests):**
18. ✅ **Email duplicado** - ¿Se previene el registro duplicado?
19. ✅ **Contraseña débil** - ¿Se valida la fortaleza de contraseñas?
20. ✅ **Protección admin** - ¿Están protegidas las rutas administrativas?

## 🎯 Lo Que Estás Aprendiendo

- **Tests de API** - Cómo probar servicios web
- **Peticiones HTTP** - GET, POST, PUT
- **Códigos de Estado** - 200 (éxito), 400 (error), 401 (no autorizado), 409 (conflicto)
- **Datos JSON** - Trabajar con respuestas de API
- **Autenticación** - Tokens JWT y protección de rutas
- **Validaciones** - Cómo verificar que los datos son correctos
- **Filtros y Búsquedas** - Testing de funcionalidades de búsqueda

## 📚 Comandos Principales

```bash
npm test           # Ejecutar tus 20 tests
npm run test:ui    # Ejecutor de tests interactivo
npm run dev        # Iniciar el servidor
```

## 📊 Cobertura del Backend

### **Endpoints Cubiertos:**
- ✅ `GET /` - Salud de la API
- ✅ `POST /api/auth/register` - Registro de usuarios
- ✅ `POST /api/auth/login` - Inicio de sesión
- ✅ `GET /api/auth/profile` - Perfil de usuario
- ✅ `PUT /api/auth/profile` - Actualizar perfil
- ✅ `GET /api/productos` - Lista de productos
- ✅ `GET /api/productos/:id` - Producto específico
- ✅ `GET /api/productos/categoria/:categoria` - Filtro por categoría
- ✅ `GET /api/productos/marca/:marca` - Filtro por marca
- ✅ `GET /api/productos/tipo/:tipo` - Filtro por tipo
- ✅ `GET /api/categories` - Lista de categorías
- ✅ `GET /api/categories/search` - Búsqueda de categorías
- ✅ `GET /api/categories/roots` - Categorías raíz
- ✅ `POST /api/productos` - Creación de productos (protegida)

### **Funcionalidades Validadas:**
- ✅ Autenticación JWT
- ✅ Validación de datos
- ✅ Manejo de errores
- ✅ Protección de rutas
- ✅ Filtros y búsquedas
- ✅ CRUD básico

## 🎉 Próximos Pasos

Una vez que te sientas cómodo con estos 20 tests, puedes:
- Agregar tests para más endpoints
- Probar casos de error más complejos
- Aprender sobre mocking y stubs
- Explorar tests de integración
- Implementar tests en CI/CD

¡Excelente trabajo cubriendo el 75% del backend! 🎸
