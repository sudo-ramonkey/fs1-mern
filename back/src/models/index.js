const mongoose = require("mongoose");

const productoSchema = require("./schemas/producto");
const instrumentoSchema = require("./schemas/instrumento");
const equipoSchema = require("./schemas/equipo");
const accesorioSchema = require("./schemas/accesorio");

const Producto =
  mongoose.models.Producto || mongoose.model("Producto", productoSchema);

Producto.discriminator("Instrumento", instrumentoSchema);
Producto.discriminator("Equipo", equipoSchema);
Producto.discriminator("Accesorio", accesorioSchema);

module.exports = { Producto };
