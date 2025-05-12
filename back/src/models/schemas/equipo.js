const mongoose = require("mongoose");

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

module.exports = equipoSchema;
