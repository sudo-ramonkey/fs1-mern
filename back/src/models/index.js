const mongoose = require("mongoose");

const productoSchema = require("./schemas/producto");
const instrumentoSchema = require("./schemas/instrumento");
const equipoSchema = require("./schemas/equipo");
const categorySchema = require("./schemas/category");
const accesorioSchema = require("./schemas/accesorio");
const userSchema = require("./schemas/user");

const Producto =
  mongoose.models.Producto || mongoose.model("Producto", productoSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

Producto.discriminator("Instrumento", instrumentoSchema);
Producto.discriminator("Equipo", equipoSchema);
Producto.discriminator("Accesorio", accesorioSchema);

module.exports = { Producto, User, Category };
