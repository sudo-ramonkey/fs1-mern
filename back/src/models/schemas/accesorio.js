const mongoose = require("mongoose");

const accesorioSchema = new mongoose.Schema({
  tipoAccesorio: {
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
      "Correa",
      "Otro"
    ],
    required: true,
  },
  compatibilidad: {
    type: String,
    enum: [
      "Guitarra Eléctrica",
      "Guitarra Acústica",
      "Bajo Eléctrico",
      "Bajo Acústico",
      "Universal",
      "Amplificador",
      "Efectos",
      "Otro"
    ]
  },
  color: String,
  material: String,
  // Campos específicos para cuerdas
  especificacionesCuerdas: {
    calibre: String, // Ej: "10-46", "9-42"
    material: {
      type: String,
      enum: ["Níquel", "Acero inoxidable", "Bronce", "Nylon", "Phosphor Bronze", "Otro", null]
    },
    recubrimiento: Boolean,
    tipoRecubrimiento: String,
    cantidadCuerdas: Number // 6, 7, 8, 12, etc.
  },
  // Campos específicos para fundas y estuches
  especificacionesFunda: {
    tipo: {
      type: String,
      enum: ["Blanda", "Semi-rígida", "Rígida", "Estuche", null]
    },
    interior: String,
    bolsillos: Number,
    resistenteAgua: Boolean
  },
  // Campos específicos para pastillas
  especificacionesPastillas: {
    tipo: {
      type: String,
      enum: ["Humbucker", "Single-coil", "P90", "Piezo", "Activa", "Pasiva", null]
    },
    posicion: {
      type: String,
      enum: ["Mástil", "Central", "Puente", "Set completo", null]
    },
    impedancia: String,
    salida: {
      type: String,
      enum: ["Alta", "Media", "Baja", null]
    }
  },
  // Campos específicos para herramientas
  especificacionesHerramientas: {
    tipoHerramienta: {
      type: String,
      enum: ["Llave de ajuste", "Kit de limpieza", "Multitool", "Destornillador", "Limas", "Pulidores", null]
    },
    usos: [String]
  },
  marca: String,
  modelo: String
});

module.exports = accesorioSchema;
