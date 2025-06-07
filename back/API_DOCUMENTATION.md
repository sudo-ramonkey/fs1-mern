# El Mundo de las Guitarras - Documentación de la API

## Resumen General
Esta API proporciona endpoints para la gestión de productos, usuarios y autenticación para la aplicación de la tienda de guitarras.

## URL Base
```
http://localhost:5000/api
```

## Autenticación
La API utiliza JWT (JSON Web Tokens) para la autenticación. Incluye el token en el header de Authorization:

```
Authorization: Bearer <tu-jwt-token>
```

## Formato de Respuesta
Todas las respuestas siguen esta estructura:

**Respuesta Exitosa:**
```json
{
  "message": "Mensaje de éxito",
  "data": { ... },
  "user": { ... },
  "token": "jwt-token"
}
```

**Respuesta de Error:**
```json
{
  "error": "Mensaje de error",
  "code": "CODIGO_ERROR",
  "details": ["Detalles adicionales del error"]
}
```

## Códigos de Error
- `NO_TOKEN` - No se proporcionó token de autenticación
- `INVALID_TOKEN` - El token es inválido o ha expirado
- `USER_NOT_FOUND` - Usuario no encontrado en la base de datos
- `ACCOUNT_DEACTIVATED` - La cuenta del usuario está desactivada
- `INSUFFICIENT_PRIVILEGES` - El usuario no tiene los permisos requeridos
- `VALIDATION_ERROR` - La validación de la solicitud falló
- `USER_EXISTS` - El usuario ya existe
- `DUPLICATE_FIELD` - Valor de campo duplicado

---

## Endpoints de Autenticación

### Registrar Usuario
**POST** `/auth/register`

Crear una nueva cuenta de usuario.

**Cuerpo:**
```json
{
  "username": "string (requerido, 3-30 caracteres)",
  "email": "string (requerido, email válido)",
  "password": "string (requerido, mín 6 caracteres)",
  "firstName": "string (opcional)",
  "lastName": "string (opcional)",
  "phone": "string (opcional)",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  },
  "role": "Admin|User (solo Admin puede establecer esto)"
}
```

**Respuesta:**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": { ... },
  "token": "jwt-token"
}
```

### Iniciar Sesión
**POST** `/auth/login`

Autenticar usuario y obtener token.

**Cuerpo:**
```json
{
  "login": "nombre de usuario o email",
  "password": "string"
}
```

**Respuesta:**
```json
{
  "message": "Inicio de sesión exitoso",
  "user": { ... },
  "token": "jwt-token"
}
```

### Obtener Perfil
**GET** `/auth/profile`

Obtener el perfil del usuario actual. Requiere autenticación.

**Respuesta:**
```json
{
  "user": {
    "id": "user-id",
    "username": "string",
    "email": "string",
    "role": "User|Admin",
    "firstName": "string",
    "lastName": "string",
    "isActive": true,
    "lastLogin": "fecha",
    "createdAt": "fecha"
  }
}
```

### Actualizar Perfil
**PUT** `/auth/profile`

Actualizar el perfil del usuario actual. Requiere autenticación.

**Cuerpo:** (igual que registrar, todos los campos opcionales)
```json
{
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "address": { ... }
}
```

### Cambiar Contraseña
**PUT** `/auth/change-password`

Cambiar la contraseña del usuario. Requiere autenticación.

**Cuerpo:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

### Renovar Token
**POST** `/auth/refresh`

Obtener un nuevo token JWT. Requiere autenticación.

**Respuesta:**
```json
{
  "message": "Token renovado exitosamente",
  "token": "nuevo-jwt-token"
}
```

### Cerrar Sesión
**POST** `/auth/logout`

Cerrar sesión del usuario (eliminación de token del lado del cliente). Requiere autenticación.

---

## Endpoints de Gestión de Usuarios (Solo Admin)

### Obtener Todos los Usuarios
**GET** `/users`

Obtener lista paginada de usuarios con filtrado.

**Parámetros de Consulta:**
- `page` - Número de página (predeterminado: 1)
- `limit` - Elementos por página (predeterminado: 10)
- `role` - Filtrar por rol (User|Admin)
- `isActive` - Filtrar por estado activo (true|false)
- `search` - Buscar en username, email, firstName, lastName
- `sortBy` - Campo de ordenamiento (predeterminado: createdAt)
- `sortOrder` - Orden de clasificación (asc|desc, predeterminado: desc)

**Respuesta:**
```json
{
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Obtener Usuario por ID
**GET** `/users/:id`

Obtener usuario específico por ID.

### Crear Usuario
**POST** `/users`

Crear nuevo usuario (mismo cuerpo que registrar).

### Actualizar Usuario
**PUT** `/users/:id`

Actualizar usuario por ID (mismo cuerpo que registrar, todos los campos opcionales).

### Eliminar Usuario
**DELETE** `/users/:id`

Eliminar usuario por ID.

### Alternar Estado del Usuario
**PATCH** `/users/:id/toggle-active`

Activar/desactivar cuenta de usuario.

### Restablecer Contraseña del Usuario
**PATCH** `/users/:id/reset-password`

Restablecer contraseña del usuario.

**Cuerpo:**
```json
{
  "newPassword": "string"
}
```

### Obtener Estadísticas de Usuarios
**GET** `/users/stats`

Obtener estadísticas de usuarios.

**Respuesta:**
```json
{
  "stats": {
    "total": 100,
    "active": 95,
    "inactive": 5,
    "admins": 2,
    "regular": 98,
    "recentSignups": 10,
    "recentlyActive": 45
  }
}
```

---

## Endpoints de Productos

### Obtener Todos los Productos
**GET** `/productos`

Obtener todos los productos con filtrado opcional.

**Parámetros de Consulta:**
- `tipo` - Filtrar por tipo (Instrumento|Equipo|Accesorio)
- `marca` - Filtrar por marca
- `categoriaProducto` - Filtrar por categoría
- `subcategoriaAccesorio` - Filtrar por subcategoría de accesorio
- `precioMin` - Precio mínimo
- `precioMax` - Precio máximo
- `tipoInstrumento` - Filtrar por tipo de instrumento
- `categoria` - Filtrar por categoría de instrumento (Acustico|Electrico)
- `subcategoriaInstrumento` - Filtrar por subcategoría de instrumento
- `numeroCuerdas` - Filtrar por número de cuerdas
- `tipoEquipo` - Filtrar por tipo de equipo
- `tipoAmplificador` - Filtrar por tipo de amplificador
- `tipoEfecto` - Filtrar por tipo de efecto
- `tipoAccesorio` - Filtrar por tipo de accesorio
- `compatibilidad` - Filtrar por compatibilidad

**Respuesta:**
```json
[
  {
    "id": "product-id",
    "nombre": "Nombre del producto",
    "descripcion": "Descripción del producto",
    "precio": 999.99,
    "marca": "Marca",
    "stock": 10,
    "tipo": "Instrumento|Equipo|Accesorio",
    "imagenes": ["imagen1.jpg", "imagen2.jpg"],
    "categoriaProducto": "Categoría",
    // Campos adicionales basados en el tipo de producto
  }
]
```

### Obtener Producto por ID
**GET** `/productos/:id`

Obtener producto específico por ID.

### Obtener Productos por Categoría
**GET** `/productos/categoria/:categoria`

Obtener productos por categoría.

### Obtener Productos por Marca
**GET** `/productos/marca/:marca`

Obtener productos por marca.

### Obtener Accesorios por Tipo
**GET** `/productos/accesorios/:tipoAccesorio`

Obtener accesorios por tipo específico.

### Obtener Instrumentos
**GET** `/productos/tipo/instrumentos`

Obtener todos los instrumentos.

### Obtener Equipos
**GET** `/productos/tipo/equipos`

Obtener todos los equipos.

### Obtener Accesorios
**GET** `/productos/tipo/accesorios`

Obtener todos los accesorios.

### Crear Producto (Solo Admin)
**POST** `/productos`

Crear nuevo producto.

**Cuerpo para Instrumento:**
```json
{
  "nombre": "string (requerido)",
  "descripcion": "string",
  "precio": "number (requerido)",
  "marca": "string",
  "stock": "number",
  "tipo": "Instrumento",
  "categoriaProducto": "Guitarras Electricas|Guitarras Acusticas|Bajos",
  "imagenes": ["string"],
  "categoria": "Acustico|Electrico|Ambos",
  "tipoInstrumento": "Guitarra|Bajo|Ukelele|Otro",
  "materialCuerpo": "string",
  "materialMastil": "string",
  "materialDiapason": "string",
  "numeroCuerdas": "number",
  "color": "string",
  "incluyeEstuche": "boolean",
  "subcategoriaInstrumento": "Stratocaster|Telecaster|Les Paul|...",
  "especificacionesGuitarra": {
    "serie": "string",
    "modeloEspecifico": "string",
    "escala": "string",
    "cantidadTrastes": "number",
    "tipoPastillas": "Humbucker|Single-coil|P90|Piezo|Otra",
    "cantidadPastillas": "number",
    "configuracionPastillas": "string",
    "controlVolumen": "number",
    "controlTono": "number",
    "selector": "string",
    "tipoPuente": "string",
    "acabado": "string",
    "paisFabricacion": "string",
    "añoModelo": "number"
  }
}
```

**Cuerpo para Equipo:**
```json
{
  "nombre": "string (requerido)",
  "descripcion": "string",
  "precio": "number (requerido)",
  "marca": "string",
  "stock": "number",
  "tipo": "Equipo",
  "categoriaProducto": "Amplificadores|Efectos",
  "imagenes": ["string"],
  "tipoEquipo": "Mezcladora|Amplificador|Parlante|Efecto|Interfaz|Otro",
  "potencia": "number",
  "entradas": "number",
  "salidas": "number",
  "caracteristicasAdicionales": "string",
  "especificacionesAmplificador": {
    "tipo": "Cabezal|Combo|Gabinete",
    "tecnologia": "Tubos|Estado Sólido|Híbrido|Modelado Digital",
    "cantidadCanales": "number",
    "tamañoAltavoz": "string",
    "tubos": {
      "previo": "string",
      "potencia": "string"
    },
    "efectosIncorporados": ["string"],
    "impedancia": "string",
    "uso": "Estudio|Práctica|Conciertos pequeños|Conciertos grandes"
  },
  "especificacionesEfecto": {
    "tipoEfecto": "Distorsión|Overdrive|Delay|Reverb|...",
    "formato": "Pedal|Pedalera|Rack|Módulo",
    "alimentacion": "Baterías|Adaptador DC|Ambos",
    "controles": ["string"],
    "bypass": "True Bypass|Buffered|Conmutable"
  }
}
```

**Cuerpo para Accesorio:**
```json
{
  "nombre": "string (requerido)",
  "descripcion": "string",
  "precio": "number (requerido)",
  "marca": "string",
  "stock": "number",
  "tipo": "Accesorio",
  "categoriaProducto": "Accesorios",
  "subcategoriaAccesorio": "Atriles & Soportes|Afinadores & Metronomos|...",
  "imagenes": ["string"],
  "tipoAccesorio": "string",
  "compatibilidad": "Guitarra Eléctrica|Guitarra Acústica|Universal|...",
  "color": "string",
  "material": "string",
  "especificacionesCuerdas": {
    "calibre": "string",
    "material": "string",
    "recubrimiento": "boolean",
    "tipoRecubrimiento": "string",
    "cantidadCuerdas": "number"
  },
  "especificacionesFunda": {
    "tipo": "Blanda|Semi-rígida|Rígida|Estuche",
    "interior": "string",
    "bolsillos": "number",
    "resistenteAgua": "boolean"
  },
  "especificacionesPastillas": {
    "tipo": "Humbucker|Single-coil|P90|Piezo|Activa|Pasiva",
    "posicion": "Mástil|Central|Puente|Set completo",
    "impedancia": "string",
    "salida": "Alta|Media|Baja"
  },
  "especificacionesHerramientas": {
    "tipoHerramienta": "string",
    "usos": ["string"]
  }
}
```

### Actualizar Producto (Solo Admin)
**PUT** `/productos/:id`

Actualizar producto por ID (mismo cuerpo que crear, todos los campos opcionales).

### Eliminar Producto (Solo Admin)
**DELETE** `/productos/:id`

Eliminar producto por ID.

---

## Códigos de Estado

- `200` - Éxito
- `201` - Creado
- `400` - Solicitud Incorrecta
- `401` - No Autorizado
- `403` - Prohibido
- `404` - No Encontrado
- `409` - Conflicto
- `500` - Error Interno del Servidor

---

## Variables de Entorno

```env
PORT=5000
MONGO_URI=mongodb://admin:password@host:port/database?authSource=admin
JWT_SECRET=tu-clave-secreta
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

---

## Scripts NPM

```bash
npm start          # Iniciar servidor de producción
npm run dev        # Iniciar servidor de desarrollo con nodemon
npm run seed       # Sembrar base de datos de productos
npm run seed-admin # Crear usuario administrador
npm run db:stats   # Mostrar estadísticas de la base de datos
npm run db:clear   # Limpiar todos los datos
npm run db:reset   # Restablecer base de datos y crear admin
npm run db:backup  # Respaldar datos a archivos JSON
npm run db:validate # Validar integridad de datos
npm run db:indexes # Crear índices de base de datos
```

---

## Colecciones de la Base de Datos

### productos
Almacena todos los productos usando discriminadores de Mongoose para diferentes tipos.

### users
Almacena cuentas de usuario con información de autenticación y roles.

---

## Solicitudes de Ejemplo

### Iniciar Sesión
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "admin",
    "password": "Admin123!"
  }'
```

### Obtener Productos
```bash
curl http://localhost:5000/api/productos?tipo=Instrumento&marca=Fender
```

### Crear Producto (con autenticación)
```bash
curl -X POST http://localhost:5000/api/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_JWT_TOKEN" \
  -d '{
    "nombre": "Stratocaster",
    "precio": 899.99,
    "tipo": "Instrumento",
    "categoriaProducto": "Guitarras Electricas"
  }'
```

---

## Notas

1. **Autenticación**: La mayoría de las operaciones de lectura son públicas, pero las operaciones de escritura requieren autenticación de administrador.
2. **Validación**: Todas las entradas son validadas en el lado del servidor.
3. **Manejo de Errores**: Mensajes de error comprensivos con códigos de error específicos.
4. **Paginación**: Las listas de usuarios admiten paginación con límites configurables.
5. **Búsqueda**: Búsqueda de texto disponible para usuarios y productos.
6. **Base de Datos**: Utiliza MongoDB con Mongoose ODM y discriminadores para tipos de productos.
7. **Seguridad**: Las contraseñas están hasheadas con bcrypt, tokens JWT para autenticación sin estado.