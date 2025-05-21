const mongoose = require("mongoose");

const options = { discriminatorKey: "tipo", collection: "productos" };

const productoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: String,
    precio: { type: Number, required: true },
    marca: { 
      type: String,
      enum: [
        // Marcas de guitarras
        "Fender", "Squier", "Jackson", "LTD", "Ibanez", 
        "Epiphone", "EVH", "Gretsch", 
        // Otras marcas
        "Gibson", "Martin", "Taylor", "Yamaha", "PRS",
        "Behringer", "Elixir", "Dunlop", "Snark", "Otros"
      ]
    },
    stock: { type: Number, default: 0 },
    tipo: {
      type: String,
      required: true,
      enum: ["Instrumento", "Equipo", "Accesorio"],
    },
    imagenes: [String],
    // Nuevo campo para categoría principal
    categoriaProducto: {
      type: String,
      enum: [
        "Guitarras Electricas", 
        "Guitarras Acusticas", 
        "Bajos", 
        "Amplificadores", 
        "Efectos", 
        "Accesorios", 
        "Otros"
      ]
    },
    // Nuevo campo para subcategorías de accesorios
    subcategoriaAccesorio: {
      type: String,
      enum: [
        "Atriles & Soportes",
        "Afinadores & Metronomos",
        "Fundas & Estuches",
        "Cables",
        "Capos",
        "Cuerdas Guitarra Acustica",
        "Cuerdas Guitarra Electrica",
        "Herramientas & Limpiadores",
        "Pastillas",
        "Puas",
        "Refacciones & Partes",
        "Slides",
        "Tahalis",
        "Lifestyle",
        null
      ]
    },
    // Campos para características específicas de filtrado
    especificaciones: {
      tipoAmplificador: {
        type: String,
        enum: ["Cabezal", "Combo", "Gabinete", null]
      },
      tipoEfecto: {
        type: String,
        enum: ["Distorsión", "Delay", "Reverb", "Modulación", "Compresor", "Multiefectos", null]
      },
      materialCuerpo: String,
      materialDiapason: String,
      paisOrigen: String,
      añoFabricacion: Number
    },
  },
  options,
);

module.exports = productoSchema;
