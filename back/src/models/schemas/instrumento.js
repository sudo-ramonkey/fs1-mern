const mongoose = require("mongoose");

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
  materialDiapason: String,
  numeroCuerdas: Number,
  color: String,
  incluyeEstuche: Boolean,
  // Campos específicos para guitarras
  especificacionesGuitarra: {
    serie: String,
    modeloEspecifico: String,
    escala: String,
    cantidadTrastes: Number,
    tipoPastillas: {
      type: String,
      enum: ["Humbucker", "Single-coil", "P90", "Piezo", "Otra", null]
    },
    cantidadPastillas: Number,
    configuracionPastillas: String, // Ej: "HSS", "HH", "SSS"
    controlVolumen: Number,
    controlTono: Number,
    selector: String, // Ej: "3 posiciones", "5 posiciones"
    tipoPuente: String,
    acabado: String,
    paisFabricacion: String,
    añoModelo: Number
  },
  // Subcategoría para filtrado más específico
  subcategoriaInstrumento: {
    type: String,
    enum: [
      // Guitarras
      "Stratocaster",
      "Telecaster",
      "Les Paul",
      "SG",
      "Flying V",
      "Explorer",
      "Jazz",
      "Folk",
      "Clásica",
      "Dreadnought",
      // Bajos
      "Jazz Bass", 
      "Precision Bass",
      "Active Bass",
      "Acoustic Bass",
      // Otros
      "Otro",
      null
    ]
  }
});

module.exports = instrumentoSchema;
