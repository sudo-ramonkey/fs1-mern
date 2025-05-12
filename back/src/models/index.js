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

const Producto =
  mongoose.models.Producto || mongoose.model("Producto", productoSchema);

// Instrumento
const instrumentoSchema = new mongoose.Schema({
  categoria: {
    type: String,
    enum: ["Acustico", "Electrico", "Ambos"],
    required: true,
  },
  tipoInstrumento: {
    type: String,
    enum: ["Guitarra", "Bajo", "Ukelele", "Otro"],
    required: true,
  },
  materialCuerpo: String,
  materialMastil: String,
  numeroCuerdas: Number,
  color: String,
  incluyeEstuche: Boolean,
});
Producto.discriminator("Instrumento", instrumentoSchema);

// Equipo de audio
const equipoSchema = new mongoose.Schema({
  tipoEquipo: {
    type: String,
    enum: ["Mezcladora", "Amplificador", "Parlante", "Otro"],
    required: true,
  },
  potencia: Number,
  entradas: Number,
  salidas: Number,
  caracteristicasAdicionales: String,
});
Producto.discriminator("Equipo", equipoSchema);

// Accesorio
const accesorioSchema = new mongoose.Schema({
  tipoAccesorio: {
    type: String,
    enum: ["Cuerdas", "Afinador", "Correa", "Puas", "Otro"],
    required: true,
  },
  compatibilidad: String,
  color: String,
  material: String,
});
Producto.discriminator("Accesorio", accesorioSchema);

module.exports = { Producto };
