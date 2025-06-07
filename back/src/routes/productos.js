const express = require("express");
const router = express.Router();

// Controller placeholders (to be implemented)
const productosController = require("../controllers/productos");
const {
  authenticate,
  authorizeAdmin,
  optionalAuth,
} = require("../middleware/auth");

// List all productos, optionally filter by tipo
router.get("/", optionalAuth, productosController.getAllProductos);

// Get productos by specific category
router.get(
  "/categoria/:categoria",
  optionalAuth,
  productosController.getByCategoria,
);

// Get productos by specific brand
router.get("/marca/:marca", optionalAuth, productosController.getByMarca);

// Get accesorios by specific type
router.get(
  "/accesorios/:tipoAccesorio",
  optionalAuth,
  productosController.getByTipoAccesorio,
);

// (Optional) Subtype-specific endpoints
router.get(
  "/tipo/instrumentos",
  optionalAuth,
  productosController.getInstrumentos,
);
router.get("/tipo/equipos", optionalAuth, productosController.getEquipos);
router.get("/tipo/accesorios", optionalAuth, productosController.getAccesorios);

// Get a single producto by ID - Note: This must be after other specific routes to avoid conflicts
router.get("/:id", optionalAuth, productosController.getProductoById);

// Create a new producto (Instrumento, Equipo, Accesorio) - Admin only
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  productosController.createProducto,
);

// Update a producto by ID - Admin only
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  productosController.updateProducto,
);

// Delete a producto by ID - Admin only
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  productosController.deleteProducto,
);

module.exports = router;
