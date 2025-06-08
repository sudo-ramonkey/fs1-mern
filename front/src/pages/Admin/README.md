# Admin Panel

Este panel de administración permite a los usuarios con rol de administrador gestionar los productos de la tienda musical.

## Características

### Autenticación y Autorización
- Solo usuarios con rol `Admin` pueden acceder al panel
- Redirección automática a la página de inicio para usuarios no autorizados
- Verificación de autenticación en tiempo real

### Gestión de Productos
- **Ver Productos**: Lista completa de todos los productos con paginación visual
- **Agregar Productos**: Formulario completo para crear nuevos productos
- **Editar Productos**: Modificación de productos existentes
- **Eliminar Productos**: Eliminación con confirmación modal

### Funcionalidades de la Lista de Productos
- Visualización de hasta 3 imágenes por producto
- Filtrado por nombre de producto
- Filtrado por tipo (Instrumento, Equipo, Accesorio)
- Información detallada de cada producto:
  - Nombre, tipo, marca, precio, stock
  - Categoría del producto
  - Descripción (truncada si es muy larga)
- Acciones rápidas de editar y eliminar

### Formulario de Productos
- Campos básicos: nombre, tipo, marca, precio, stock, descripción
- Hasta 3 imágenes por producto (URLs)
- Vista previa de imágenes en tiempo real
- Campos específicos según el tipo de producto:

#### Para Instrumentos
- Categoría (Acústico, Eléctrico, Ambos)
- Tipo de instrumento (Guitarra, Bajo, Ukelele, Otro)
- Materiales (cuerpo, mástil, diapasón)
- Número de cuerdas
- Color
- Incluye estuche

#### Para Equipos
- Tipo de equipo (Mezcladora, Amplificador, Parlante, Efecto, Interfaz, Otro)
- Potencia, entradas, salidas
- Características adicionales

#### Para Accesorios
- Tipo de accesorio (múltiples opciones disponibles)
- Compatibilidad (Guitarra Eléctrica, Acústica, etc.)
- Material

## Acceso al Panel

### Desde la Interfaz
1. Iniciar sesión como administrador
2. Hacer clic en el icono de usuario en la barra superior
3. Seleccionar "Panel de Admin" en el menú desplegable

### URL Directa
- Navegar a `/admin` (requiere autenticación previa)

## Estructura de Archivos

```
src/pages/Admin/
├── index.js          # Componente principal del panel
├── ProductList.js    # Lista y gestión de productos
├── ProductForm.js    # Formulario para crear/editar productos
├── Admin.css         # Estilos del panel de administración
└── README.md         # Esta documentación
```

## Seguridad

- Verificación de rol de administrador en el frontend
- Verificación adicional en el backend para todas las operaciones CRUD
- Tokens JWT requeridos para todas las operaciones de productos
- Protección contra acceso no autorizado

## Estilos y UX

- Diseño responsive para dispositivos móviles y desktop
- Interfaz moderna con transiciones suaves
- Confirmaciones modales para acciones destructivas
- Indicadores de carga y mensajes de error/éxito
- Vista previa de imágenes en tiempo real

## API Endpoints Utilizados

- `GET /api/productos` - Obtener todos los productos
- `POST /api/productos` - Crear nuevo producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto

Todos los endpoints de modificación requieren autenticación de administrador.