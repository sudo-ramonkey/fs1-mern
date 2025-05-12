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
  numeroCuerdas: Number,
  color: String,
  incluyeEstuche: Boolean,
});

module.exports = instrumentoSchema;
