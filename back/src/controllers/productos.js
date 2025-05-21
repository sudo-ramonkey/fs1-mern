const { Producto } = require("../models/");

// Helper to build filter based on query parameters
const buildFilter = (queryParams) => {
  const filter = {};
  
  // Basic filters
  if (queryParams.tipo) filter.tipo = queryParams.tipo;
  if (queryParams.marca) filter.marca = queryParams.marca;
  if (queryParams.categoriaProducto) filter.categoriaProducto = queryParams.categoriaProducto;
  if (queryParams.subcategoriaAccesorio) filter.subcategoriaAccesorio = queryParams.subcategoriaAccesorio;
  
  // Price range filter
  if (queryParams.precioMin || queryParams.precioMax) {
    filter.precio = {};
    if (queryParams.precioMin) filter.precio.$gte = Number(queryParams.precioMin);
    if (queryParams.precioMax) filter.precio.$lte = Number(queryParams.precioMax);
  }
  
  // Instrument specific filters
  if (queryParams.tipoInstrumento) filter['tipoInstrumento'] = queryParams.tipoInstrumento;
  if (queryParams.categoria) filter['categoria'] = queryParams.categoria;
  if (queryParams.subcategoriaInstrumento) filter['subcategoriaInstrumento'] = queryParams.subcategoriaInstrumento;
  if (queryParams.numeroCuerdas) filter['numeroCuerdas'] = Number(queryParams.numeroCuerdas);
  
  // Equipment specific filters
  if (queryParams.tipoEquipo) filter['tipoEquipo'] = queryParams.tipoEquipo;
  if (queryParams.tipoAmplificador) filter['especificacionesAmplificador.tipo'] = queryParams.tipoAmplificador;
  if (queryParams.tipoEfecto) filter['especificacionesEfecto.tipoEfecto'] = queryParams.tipoEfecto;
  
  // Accessory specific filters
  if (queryParams.tipoAccesorio) filter['tipoAccesorio'] = queryParams.tipoAccesorio;
  if (queryParams.compatibilidad) filter['compatibilidad'] = queryParams.compatibilidad;
  
  return filter;
};

// GET /api/productos
async function getAllProductos(req, res) {
  try {
    const filter = buildFilter(req.query);
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
    
    // Add validation for new required fields
    if (tipo === "Instrumento" && !data.categoriaProducto) {
      return res.status(400).json({ error: "categoriaProducto is required for Instrumentos" });
    }
    
    if (tipo === "Accesorio" && !data.tipoAccesorio) {
      return res.status(400).json({ error: "tipoAccesorio is required for Accesorios" });
    }
    
    if (tipo === "Equipo" && !data.tipoEquipo) {
      return res.status(400).json({ error: "tipoEquipo is required for Equipos" });
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
    const filter = { tipo: "Instrumento", ...buildFilter(req.query) };
    const instrumentos = await Producto.find(filter);
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
    const filter = { tipo: "Equipo", ...buildFilter(req.query) };
    const equipos = await Producto.find(filter);
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
    const filter = { tipo: "Accesorio", ...buildFilter(req.query) };
    const accesorios = await Producto.find(filter);
    res.json(accesorios);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching accesorios", details: err.message });
  }
}

// GET /api/productos/categoria/:categoria
async function getByCategoria(req, res) {
  try {
    const { categoria } = req.params;
    const filter = { categoriaProducto: categoria, ...buildFilter(req.query) };
    const productos = await Producto.find(filter);
    res.json(productos);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching products by category", details: err.message });
  }
}

// GET /api/productos/marca/:marca
async function getByMarca(req, res) {
  try {
    const { marca } = req.params;
    const filter = { marca, ...buildFilter(req.query) };
    const productos = await Producto.find(filter);
    res.json(productos);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching products by brand", details: err.message });
  }
}

// GET /api/productos/accessorios/:tipoAccesorio
async function getByTipoAccesorio(req, res) {
  try {
    const { tipoAccesorio } = req.params;
    const filter = { 
      tipo: "Accesorio", 
      tipoAccesorio,
      ...buildFilter(req.query)
    };
    const productos = await Producto.find(filter);
    res.json(productos);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching accessories by type", details: err.message });
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
  getByCategoria,
  getByMarca,
  getByTipoAccesorio
};
