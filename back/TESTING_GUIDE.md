# Guía de Pruebas - El Mundo de las Guitarras API

## 🚀 Introducción

Esta guía te ayudará a probar todos los endpoints de la API utilizando diferentes métodos y herramientas.

## 🔧 Configuración Inicial

### 1. Instalación de Dependencias

```bash
cd fs1-mern/back
npm install
```

### 2. Variables de Entorno

Asegúrate de que tu archivo `.env` contenga:

```env
PORT=5000
MONGO_URI=mongodb://admin:SuperPasswordDificil@fs1.teclaguna.systems:27017/elmundodelasguitarras?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
JWT_EXPIRES_IN=24h

# Testing Configuration
TESTING_MODE=true
TESTING_ADMIN_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0aW5nLWFkbWluLTEyMzQiLCJ1c2VybmFtZSI6InRlc3RpbmctYWRtaW4iLCJlbWFpbCI6InRlc3RpbmdAZWxtdW5kb2RlbGFzZ3VpdGFycmFzLmNvbSIsInJvbGUiOiJBZG1pbiIsInRlc3RpbmciOnRydWUsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjozMjUwMzY4MDAwMH0.testing-token-signature-for-development-only
TESTING_USER_ID=testing-admin-1234
```

### 3. Iniciar el Servidor

```bash
npm run dev
```

## 🔑 Token de Prueba Permanente

Para facilitar las pruebas, se ha creado un **token de administrador permanente** que puedes usar:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0aW5nLWFkbWluLTEyMzQiLCJ1c2VybmFtZSI6InRlc3RpbmctYWRtaW4iLCJlbWFpbCI6InRlc3RpbmdAZWxtdW5kb2RlbGFzZ3VpdGFycmFzLmNvbSIsInJvbGUiOiJBZG1pbiIsInRlc3RpbmciOnRydWUsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjozMjUwMzY4MDAwMH0.testing-token-signature-for-development-only
```

**⚠️ IMPORTANTE:** Este token solo funciona cuando `TESTING_MODE=true` en tu archivo `.env`.

## 🛠️ Métodos de Prueba

### Método 1: Scripts NPM Automatizados

#### Ejecutar Todas las Pruebas
```bash
npm run test:api
```

#### Pruebas Específicas
```bash
npm run test:auth        # Solo autenticación
npm run test:products    # Solo productos
npm run test:users       # Solo gestión de usuarios
```

### Método 2: cURL (Línea de Comandos)

#### Ejemplos Básicos

**Obtener Todos los Productos (Público):**
```bash
curl -X GET http://localhost:5000/api/productos
```

**Crear Producto (Requiere Admin):**
```bash
curl -X POST http://localhost:5000/api/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0aW5nLWFkbWluLTEyMzQiLCJ1c2VybmFtZSI6InRlc3RpbmctYWRtaW4iLCJlbWFpbCI6InRlc3RpbmdAZWxtdW5kb2RlbGFzZ3VpdGFycmFzLmNvbSIsInJvbGUiOiJBZG1pbiIsInRlc3RpbmciOnRydWUsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjozMjUwMzY4MDAwMH0.testing-token-signature-for-development-only" \
  -d '{
    "nombre": "Guitarra Test",
    "descripcion": "Una guitarra de prueba",
    "precio": 999.99,
    "marca": "Fender",
    "stock": 5,
    "tipo": "Instrumento",
    "categoriaProducto": "Guitarras Electricas",
    "categoria": "Electrico",
    "tipoInstrumento": "Guitarra",
    "materialCuerpo": "Aliso",
    "materialMastil": "Arce",
    "numeroCuerdas": 6,
    "color": "Sunburst",
    "incluyeEstuche": false
  }'
```

**Iniciar Sesión con Admin Default:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "admin",
    "password": "Admin123!"
  }'
```

### Método 3: Postman

1. **Importar Colección:**
   - Abre Postman
   - Click en "Import"
   - Selecciona el archivo `El_Mundo_Guitarras_API.postman_collection.json`

2. **Configurar Variables:**
   - La colección ya incluye las variables necesarias
   - `baseUrl`: http://localhost:5000/api
   - `testingToken`: Token de administrador permanente

3. **Ejecutar Pruebas:**
   - Usa la colección organizada por categorías
   - Los tokens se guardan automáticamente en variables de entorno

### Método 4: Navegador Web (Solo GET)

Para endpoints públicos puedes usar directamente el navegador:

```
http://localhost:5000/api/productos
http://localhost:5000/api/productos/tipo/instrumentos
http://localhost:5000/api/productos?marca=Fender
```

## 📝 Ejemplos de Pruebas Específicas

### Autenticación

#### 1. Registrar Usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

#### 2. Obtener Perfil (Con Token de Testing)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0aW5nLWFkbWluLTEyMzQiLCJ1c2VybmFtZSI6InRlc3RpbmctYWRtaW4iLCJlbWFpbCI6InRlc3RpbmdAZWxtdW5kb2RlbGFzZ3VpdGFycmFzLmNvbSIsInJvbGUiOiJBZG1pbiIsInRlc3RpbmciOnRydWUsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjozMjUwMzY4MDAwMH0.testing-token-signature-for-development-only"
```

### Productos

#### 1. Filtrar Productos
```bash
curl "http://localhost:5000/api/productos?tipo=Instrumento&marca=Fender&precioMin=500&precioMax=2000"
```

#### 2. Crear Amplificador
```bash
curl -X POST http://localhost:5000/api/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN_AQUI]" \
  -d '{
    "nombre": "Blues Junior Test",
    "descripcion": "Amplificador de prueba",
    "precio": 749.99,
    "marca": "Fender",
    "stock": 3,
    "tipo": "Equipo",
    "categoriaProducto": "Amplificadores",
    "tipoEquipo": "Amplificador",
    "potencia": 15,
    "entradas": 2,
    "salidas": 1,
    "especificacionesAmplificador": {
      "tipo": "Combo",
      "tecnologia": "Tubos",
      "cantidadCanales": 1,
      "tamañoAltavoz": "12 pulgadas",
      "uso": "Práctica"
    }
  }'
```

### Gestión de Usuarios (Solo Admin)

#### 1. Obtener Todos los Usuarios
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer [TOKEN_ADMIN]"
```

#### 2. Crear Usuario
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN_ADMIN]" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "NewUser123!",
    "firstName": "Nuevo",
    "lastName": "Usuario",
    "role": "User"
  }'
```

## 🔍 Verificación de Respuestas

### Respuestas Exitosas

**Producto Creado (201):**
```json
{
  "message": "Producto created successfully",
  "_id": "507f1f77bcf86cd799439011",
  "nombre": "Guitarra Test",
  "precio": 999.99,
  // ... otros campos
}
```

**Login Exitoso (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "email": "admin@elmundodelasguitarras.com",
    "role": "Admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Respuestas de Error

**No Autorizado (401):**
```json
{
  "error": "Access denied. No token provided.",
  "code": "NO_TOKEN"
}
```

**Permisos Insuficientes (403):**
```json
{
  "error": "Access denied. Admin privileges required.",
  "code": "INSUFFICIENT_PRIVILEGES"
}
```

**Validación Fallida (400):**
```json
{
  "error": "Validation failed",
  "details": ["Password must be at least 6 characters long"],
  "code": "VALIDATION_ERROR"
}
```

## 🧪 Casos de Prueba Recomendados

### 1. Flujo Completo de Usuario
1. Registrar nuevo usuario
2. Iniciar sesión
3. Obtener perfil
4. Actualizar perfil
5. Cambiar contraseña
6. Cerrar sesión

### 2. Flujo de Productos (Admin)
1. Obtener todos los productos (público)
2. Crear nuevo producto (admin)
3. Obtener producto por ID
4. Actualizar producto
5. Eliminar producto

### 3. Filtrado y Búsqueda
1. Filtrar por tipo, marca, precio
2. Buscar por categoría
3. Obtener por subcategorías
4. Combinar múltiples filtros

### 4. Manejo de Errores
1. Acceso sin token
2. Token inválido/expirado
3. Credenciales incorrectas
4. Campos requeridos faltantes
5. IDs inválidos
6. Operaciones no permitidas

### 5. Gestión de Usuarios (Admin)
1. Listar usuarios con paginación
2. Buscar usuarios
3. Crear/actualizar/eliminar usuarios
4. Cambiar estado de usuario
5. Restablecer contraseñas

## 🚨 Solución de Problemas

### Error: "ECONNREFUSED"
- Verifica que el servidor esté ejecutándose (`npm run dev`)
- Confirma que el puerto 5000 esté disponible

### Error: "Invalid token"
- Verifica que `TESTING_MODE=true` en `.env`
- Usa el token de testing completo
- Revisa que el header Authorization esté bien formateado: `Bearer TOKEN`

### Error: "User not found"
- Si usas un token real, asegúrate de que el usuario exista en la base de datos
- Para testing, usa el token de testing que no requiere usuario en DB

### Error de Conexión a MongoDB
- Verifica la cadena de conexión en `MONGO_URI`
- Confirma que el servidor de MongoDB esté accesible

## 📚 Scripts Útiles

```bash
# Preparar base de datos para testing
npm run db:reset

# Crear usuario admin
npm run seed-admin

# Ver estadísticas de la base de datos
npm run db:stats

# Sembrar productos de prueba
npm run seed

# Limpiar toda la base de datos
npm run db:clear
```

## 🔐 Seguridad en Testing

**⚠️ RECORDATORIOS IMPORTANTES:**

1. El token de testing **SOLO** funciona en modo desarrollo
2. **NUNCA** uses `TESTING_MODE=true` en producción
3. Cambia las credenciales por defecto en producción
4. El token de testing tiene permisos completos de administrador

## 📊 Herramientas Adicionales

### Thunder Client (VS Code)
Si usas VS Code, Thunder Client es una excelente alternativa a Postman integrada en el editor.

### Insomnia
Otra alternativa popular para pruebas de API con una interfaz similar a Postman.

### HTTPie
Herramienta de línea de comandos más amigable que cURL:

```bash
# Instalar HTTPie
pip install httpie

# Ejemplo de uso
http GET localhost:5000/api/productos
http POST localhost:5000/api/productos Authorization:"Bearer TOKEN" nombre="Test" precio:=999.99
```

---
