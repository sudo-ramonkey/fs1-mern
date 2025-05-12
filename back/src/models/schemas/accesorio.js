const mongoose = require("mongoose");

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

module.exports = accesorioSchema;
