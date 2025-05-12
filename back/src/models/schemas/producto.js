const mongoose = require("mongoose");

const options = { discriminatorKey: "tipo", collection: "productos" };

const productoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: String,
    precio: { type: Number, required: true },
    marca: String,
    stock: { type: Number, default: 0 },
    tipo: {
      type: String,
      required: true,
      enum: ["Instrumento", "Equipo", "Accesorio"],
    },
    imagenes: [String],
  },
  options,
);

module.exports = productoSchema;
