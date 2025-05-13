const express = require("express");
const router = express.Router();

// Controller placeholders (to be implemented)
const productosController = require("../controllers/productos");

// List all productos, optionally filter by tipo
router.get("/", productosController.getAllProductos);

// Get a single producto by ID
router.get("/:id", productosController.getProductoById);

// Create a new producto (Instrumento, Equipo, Accesorio)
router.post("/", productosController.createProducto);

// Update a producto by ID
router.put("/:id", productosController.updateProducto);

// Delete a producto by ID
router.delete("/:id", productosController.deleteProducto);

// (Optional) Subtype-specific endpoints
router.get("/tipo/instrumentos", productosController.getInstrumentos);
router.get("/tipo/equipos", productosController.getEquipos);
router.get("/tipo/accesorios", productosController.getAccesorios);

module.exports = router;
