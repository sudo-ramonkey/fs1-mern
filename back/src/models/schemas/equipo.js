const mongoose = require("mongoose");

const equipoSchema = new mongoose.Schema({
  tipoEquipo: {
    type: String,
    enum: ["Mezcladora", "Amplificador", "Parlante", "Efecto", "Interfaz", "Otro"],
    required: true,
  },
  potencia: Number,
  entradas: Number,
  salidas: Number,
  caracteristicasAdicionales: String,
  // Detalles específicos para amplificadores
  especificacionesAmplificador: {
    tipo: {
      type: String,
      enum: ["Cabezal", "Combo", "Gabinete", null]
    },
    tecnologia: {
      type: String,
      enum: ["Tubos", "Estado Sólido", "Híbrido", "Modelado Digital", null]
    },
    cantidadCanales: Number,
    tamañoAltavoz: String, // Ej: "12 pulgadas", "2x10 pulgadas"
    tubos: {
      previo: String, // Ej: "2x12AX7"
      potencia: String // Ej: "2xEL84"
    },
    efectosIncorporados: [String], // Array de efectos incluidos
    impedancia: String,
    uso: {
      type: String,
      enum: ["Estudio", "Práctica", "Conciertos pequeños", "Conciertos grandes", null]
    }
  },
  // Detalles específicos para efectos
  especificacionesEfecto: {
    tipoEfecto: {
      type: String,
      enum: [
        "Distorsión", "Overdrive", "Fuzz", 
        "Compresor", "Limitador", "Puerta de ruido",
        "Delay", "Reverb", "Eco", 
        "Chorus", "Flanger", "Phaser", "Tremolo",
        "Wah", "Filtro", "EQ", 
        "Pitch Shifter", "Octavador", 
        "Looper", "Multiefectos",
        null
      ]
    },
    formato: {
      type: String,
      enum: ["Pedal", "Pedalera", "Rack", "Módulo", null]
    },
    alimentacion: {
      type: String,
      enum: ["Baterías", "Adaptador DC", "Ambos", null]
    },
    controles: [String], // Array de controles disponibles
    bypass: {
      type: String,
      enum: ["True Bypass", "Buffered", "Conmutable", null]
    }
  }
});

module.exports = equipoSchema;
