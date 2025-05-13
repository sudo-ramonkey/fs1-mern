const { Producto } = require("../models/");

// Helper to filter by tipo
const buildTipoFilter = (tipo) => (tipo ? { tipo } : {});

// GET /api/productos
async function getAllProductos(req, res) {
  try {
    const { tipo } = req.query;
    const filter = buildTipoFilter(tipo);
    const productos = await Producto.find(filter);
    res.json(productos);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching productos", details: err.message });
  }
}

// GET /api/productos/:id
async function getProductoById(req, res) {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: "Producto not found" });
    }
    res.json(producto);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching producto", details: err.message });
  }
}

// POST /api/productos
async function createProducto(req, res) {
  try {
    const { tipo, ...data } = req.body;
    if (!tipo || !["Instrumento", "Equipo", "Accesorio"].includes(tipo)) {
      return res.status(400).json({ error: "Invalid or missing 'tipo'" });
    }
    const producto = await Producto.create({ tipo, ...data });
    res.status(201).json(producto);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error creating producto", details: err.message });
  }
}

// PUT /api/productos/:id
async function updateProducto(req, res) {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!producto) {
      return res.status(404).json({ error: "Producto not found" });
    }
    res.json(producto);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error updating producto", details: err.message });
  }
}

// DELETE /api/productos/:id
async function deleteProducto(req, res) {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: "Producto not found" });
    }
    res.json({ message: "Producto deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error deleting producto", details: err.message });
  }
}

// GET /api/productos/tipo/instrumentos
async function getInstrumentos(req, res) {
  try {
    const instrumentos = await Producto.find({ tipo: "Instrumento" });
    res.json(instrumentos);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching instrumentos", details: err.message });
  }
}

// GET /api/productos/tipo/equipos
async function getEquipos(req, res) {
  try {
    const equipos = await Producto.find({ tipo: "Equipo" });
    res.json(equipos);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching equipos", details: err.message });
  }
}

// GET /api/productos/tipo/accesorios
async function getAccesorios(req, res) {
  try {
    const accesorios = await Producto.find({ tipo: "Accesorio" });
    res.json(accesorios);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching accesorios", details: err.message });
  }
}

module.exports = {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  getInstrumentos,
  getEquipos,
  getAccesorios,
};
