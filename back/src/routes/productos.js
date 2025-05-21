const express = require("express");
const router = express.Router();

// Controller placeholders (to be implemented)
const productosController = require("../controllers/productos");

// List all productos, optionally filter by tipo
router.get("/", productosController.getAllProductos);

// Get productos by specific category
router.get("/categoria/:categoria", productosController.getByCategoria);

// Get productos by specific brand
router.get("/marca/:marca", productosController.getByMarca);

// Get accesorios by specific type
router.get("/accesorios/:tipoAccesorio", productosController.getByTipoAccesorio);

// (Optional) Subtype-specific endpoints
router.get("/tipo/instrumentos", productosController.getInstrumentos);
router.get("/tipo/equipos", productosController.getEquipos);
router.get("/tipo/accesorios", productosController.getAccesorios);

// Get a single producto by ID - Note: This must be after other specific routes to avoid conflicts
router.get("/:id", productosController.getProductoById);

// Create a new producto (Instrumento, Equipo, Accesorio)
router.post("/", productosController.createProducto);

// Update a producto by ID
router.put("/:id", productosController.updateProducto);

// Delete a producto by ID
router.delete("/:id", productosController.deleteProducto);

module.exports = router;
