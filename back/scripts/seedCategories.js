require("dotenv").config();
const mongoose = require("mongoose");
const { Category } = require("../src/models");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/fs1-mern";

const seedCategories = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing categories
    await Category.deleteMany({});
    console.log("Cleared existing categories");

    // Root categories
    const instrumentos = await Category.create({
      name: "Instrumentos",
      description: "Instrumentos musicales de cuerda",
      isActive: true,
      sortOrder: 1,
      icon: "🎸"
    });

    const equipos = await Category.create({
      name: "Equipos",
      description: "Amplificadores y equipos de sonido",
      isActive: true,
      sortOrder: 2,
      icon: "🔊"
    });

    const accesorios = await Category.create({
      name: "Accesorios",
      description: "Accesorios y repuestos",
      isActive: true,
      sortOrder: 3,
      icon: "🎵"
    });

    // Guitarras subcategories
    const guitarras = await Category.create({
      name: "Guitarras",
      description: "Guitarras eléctricas y acústicas",
      parent: instrumentos._id,
      isActive: true,
      sortOrder: 1
    });

    const guitarrasElectricas = await Category.create({
      name: "Guitarras Eléctricas",
      description: "Guitarras eléctricas de diferentes estilos",
      parent: guitarras._id,
      isActive: true,
      sortOrder: 1
    });

    const guitarrasAcusticas = await Category.create({
      name: "Guitarras Acústicas",
      description: "Guitarras acústicas y electroacústicas",
      parent: guitarras._id,
      isActive: true,
      sortOrder: 2
    });

    // Guitar brand subcategories
    await Category.create({
      name: "Fender",
      description: "Guitarras Fender y Squier",
      parent: guitarrasElectricas._id,
      isActive: true,
      sortOrder: 1
    });

    await Category.create({
      name: "Gibson",
      description: "Guitarras Gibson y Epiphone",
      parent: guitarrasElectricas._id,
      isActive: true,
      sortOrder: 2
    });

    await Category.create({
      name: "Ibanez",
      description: "Guitarras Ibanez",
      parent: guitarrasElectricas._id,
      isActive: true,
      sortOrder: 3
    });

    // Bass guitars
    const bajos = await Category.create({
      name: "Bajos",
      description: "Bajos eléctricos y acústicos",
      parent: instrumentos._id,
      isActive: true,
      sortOrder: 2
    });

    await Category.create({
      name: "Bajos Eléctricos",
      description: "Bajos eléctricos de 4, 5 y 6 cuerdas",
      parent: bajos._id,
      isActive: true,
      sortOrder: 1
    });

    // Amplifiers
    const amplificadores = await Category.create({
      name: "Amplificadores",
      description: "Amplificadores para guitarra y bajo",
      parent: equipos._id,
      isActive: true,
      sortOrder: 1
    });

    await Category.create({
      name: "Amplificadores de Guitarra",
      description: "Amplificadores específicos para guitarra",
      parent: amplificadores._id,
      isActive: true,
      sortOrder: 1
    });

    await Category.create({
      name: "Amplificadores de Bajo",
      description: "Amplificadores específicos para bajo",
      parent: amplificadores._id,
      isActive: true,
      sortOrder: 2
    });

    // Effects
    const efectos = await Category.create({
      name: "Efectos",
      description: "Pedales y procesadores de efectos",
      parent: equipos._id,
      isActive: true,
      sortOrder: 2
    });

    await Category.create({
      name: "Distorsión",
      description: "Pedales de distorsión y overdrive",
      parent: efectos._id,
      isActive: true,
      sortOrder: 1
    });

    await Category.create({
      name: "Delay y Reverb",
      description: "Efectos de tiempo y espaciales",
      parent: efectos._id,
      isActive: true,
      sortOrder: 2
    });

    // Accessories
    const cuerdas = await Category.create({
      name: "Cuerdas",
      description: "Cuerdas para guitarra y bajo",
      parent: accesorios._id,
      isActive: true,
      sortOrder: 1
    });

    await Category.create({
      name: "Cuerdas de Guitarra",
      description: "Cuerdas para guitarra eléctrica y acústica",
      parent: cuerdas._id,
      isActive: true,
      sortOrder: 1
    });

    await Category.create({
      name: "Cuerdas de Bajo",
      description: "Cuerdas para bajo eléctrico",
      parent: cuerdas._id,
      isActive: true,
      sortOrder: 2
    });

    const puas = await Category.create({
      name: "Púas",
      description: "Púas y accesorios de ejecución",
      parent: accesorios._id,
      isActive: true,
      sortOrder: 2
    });

    const fundas = await Category.create({
      name: "Fundas y Estuches",
      description: "Protección y transporte de instrumentos",
      parent: accesorios._id,
      isActive: true,
      sortOrder: 3
    });

    console.log("Categories seeded successfully!");
    
    // Update product counts
    await Category.updateProductCounts();
    console.log("Product counts updated");

    // Display tree structure
    const tree = await Category.getTree();
    console.log("\nCategory tree structure:");
    console.log(JSON.stringify(tree, null, 2));

  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run if called directly
if (require.main === module) {
  seedCategories();
}

module.exports = seedCategories;
