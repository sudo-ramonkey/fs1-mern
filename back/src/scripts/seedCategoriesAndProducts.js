require("dotenv").config();
const mongoose = require("mongoose");
const { Category, Producto, User } = require("../models");

// Database connection
const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGO_URI_LOCAL ||
  "mongodb://localhost:27017/fs1-mern";

const seedData = {
  categories: [
    // Root categories
    {
      name: "Guitarras",
      slug: "guitarras",
      description: "Todo tipo de guitarras para músicos de todos los niveles",
      icon: "🎸",
      sortOrder: 1,
      children: [
        {
          name: "Guitarras Eléctricas",
          slug: "guitarras-electricas",
          description: "Guitarras eléctricas para rock, blues, jazz y más",
          icon: "⚡",
          sortOrder: 1,
          children: [
            {
              name: "Stratocaster",
              slug: "stratocaster",
              description: "Guitarras tipo Stratocaster",
              sortOrder: 1,
            },
            {
              name: "Telecaster",
              slug: "telecaster",
              description: "Guitarras tipo Telecaster",
              sortOrder: 2,
            },
            {
              name: "Les Paul",
              slug: "les-paul",
              description: "Guitarras tipo Les Paul",
              sortOrder: 3,
            },
            {
              name: "SG",
              slug: "sg",
              description: "Guitarras tipo SG",
              sortOrder: 4,
            },
            {
              name: "Semi-Hollow",
              slug: "semi-hollow",
              description: "Guitarras semi-huecas",
              sortOrder: 5,
            },
          ],
        },
        {
          name: "Guitarras Acústicas",
          slug: "guitarras-acusticas",
          description: "Guitarras acústicas y electroacústicas",
          icon: "🎵",
          sortOrder: 2,
          children: [
            {
              name: "Dreadnought",
              slug: "dreadnought",
              description: "Guitarras acústicas tipo Dreadnought",
              sortOrder: 1,
            },
            {
              name: "Folk",
              slug: "folk",
              description: "Guitarras folk y parlor",
              sortOrder: 2,
            },
            {
              name: "Clásica",
              slug: "clasica",
              description: "Guitarras clásicas y de nylon",
              sortOrder: 3,
            },
            {
              name: "Jumbo",
              slug: "jumbo",
              description: "Guitarras jumbo de gran cuerpo",
              sortOrder: 4,
            },
          ],
        },
        {
          name: "Guitarras de 12 Cuerdas",
          slug: "guitarras-12-cuerdas",
          description: "Guitarras de 12 cuerdas acústicas y eléctricas",
          sortOrder: 3,
        },
      ],
    },
    {
      name: "Bajos",
      slug: "bajos",
      description: "Bajos eléctricos y acústicos",
      icon: "🎸",
      sortOrder: 2,
      children: [
        {
          name: "Bajos de 4 Cuerdas",
          slug: "bajos-4-cuerdas",
          description: "Bajos eléctricos de 4 cuerdas",
          sortOrder: 1,
        },
        {
          name: "Bajos de 5 Cuerdas",
          slug: "bajos-5-cuerdas",
          description: "Bajos eléctricos de 5 cuerdas",
          sortOrder: 2,
        },
        {
          name: "Bajos de 6 Cuerdas",
          slug: "bajos-6-cuerdas",
          description: "Bajos eléctricos de 6 cuerdas",
          sortOrder: 3,
        },
        {
          name: "Bajos Acústicos",
          slug: "bajos-acusticos",
          description: "Bajos acústicos y upright",
          sortOrder: 4,
        },
      ],
    },
    {
      name: "Amplificadores",
      slug: "amplificadores",
      description: "Amplificadores para guitarras y bajos",
      icon: "🔊",
      sortOrder: 3,
      children: [
        {
          name: "Amplificadores de Guitarra",
          slug: "amplificadores-guitarra",
          description: "Amplificadores específicos para guitarra",
          sortOrder: 1,
          children: [
            {
              name: "Combos",
              slug: "combos-guitarra",
              description: "Amplificadores combo para guitarra",
              sortOrder: 1,
            },
            {
              name: "Cabezales",
              slug: "cabezales-guitarra",
              description: "Cabezales de amplificador para guitarra",
              sortOrder: 2,
            },
            {
              name: "Gabinetes",
              slug: "gabinetes-guitarra",
              description: "Gabinetes para guitarra",
              sortOrder: 3,
            },
          ],
        },
        {
          name: "Amplificadores de Bajo",
          slug: "amplificadores-bajo",
          description: "Amplificadores específicos para bajo",
          sortOrder: 2,
          children: [
            {
              name: "Combos",
              slug: "combos-bajo",
              description: "Amplificadores combo para bajo",
              sortOrder: 1,
            },
            {
              name: "Cabezales",
              slug: "cabezales-bajo",
              description: "Cabezales de amplificador para bajo",
              sortOrder: 2,
            },
          ],
        },
        {
          name: "Amplificadores Acústicos",
          slug: "amplificadores-acusticos",
          description: "Amplificadores para instrumentos acústicos",
          sortOrder: 3,
        },
      ],
    },
    {
      name: "Efectos",
      slug: "efectos",
      description: "Pedales y efectos para guitarra y bajo",
      icon: "🎛️",
      sortOrder: 4,
      children: [
        {
          name: "Distorsión",
          slug: "distorsion",
          description: "Pedales de distorsión y overdrive",
          sortOrder: 1,
        },
        {
          name: "Delay",
          slug: "delay",
          description: "Pedales de delay y eco",
          sortOrder: 2,
        },
        {
          name: "Reverb",
          slug: "reverb",
          description: "Pedales de reverb",
          sortOrder: 3,
        },
        {
          name: "Modulación",
          slug: "modulacion",
          description: "Chorus, flanger, phaser y otros efectos de modulación",
          sortOrder: 4,
        },
        {
          name: "Compresor",
          slug: "compresor",
          description: "Pedales compresores y limitadores",
          sortOrder: 5,
        },
        {
          name: "Multiefectos",
          slug: "multiefectos",
          description: "Pedaleras multiefectos",
          sortOrder: 6,
        },
      ],
    },
    {
      name: "Accesorios",
      slug: "accesorios",
      description: "Accesorios para instrumentos musicales",
      icon: "🎯",
      sortOrder: 5,
      children: [
        {
          name: "Cuerdas",
          slug: "cuerdas",
          description: "Cuerdas para guitarra y bajo",
          sortOrder: 1,
          children: [
            {
              name: "Cuerdas Guitarra Eléctrica",
              slug: "cuerdas-guitarra-electrica",
              description: "Cuerdas para guitarra eléctrica",
              sortOrder: 1,
            },
            {
              name: "Cuerdas Guitarra Acústica",
              slug: "cuerdas-guitarra-acustica",
              description: "Cuerdas para guitarra acústica",
              sortOrder: 2,
            },
            {
              name: "Cuerdas Bajo",
              slug: "cuerdas-bajo",
              description: "Cuerdas para bajo eléctrico",
              sortOrder: 3,
            },
            {
              name: "Cuerdas Clásica",
              slug: "cuerdas-clasica",
              description: "Cuerdas de nylon para guitarra clásica",
              sortOrder: 4,
            },
          ],
        },
        {
          name: "Cables",
          slug: "cables",
          description: "Cables para instrumentos",
          sortOrder: 2,
        },
        {
          name: "Púas",
          slug: "puas",
          description: "Púas y plumillas",
          sortOrder: 3,
        },
        {
          name: "Fundas y Estuches",
          slug: "fundas-estuches",
          description: "Fundas y estuches para instrumentos",
          sortOrder: 4,
        },
        {
          name: "Atriles y Soportes",
          slug: "atriles-soportes",
          description: "Atriles y soportes para instrumentos",
          sortOrder: 5,
        },
        {
          name: "Afinadores y Metrónomos",
          slug: "afinadores-metronomos",
          description: "Afinadores y metrónomos",
          sortOrder: 6,
        },
        {
          name: "Capos",
          slug: "capos",
          description: "Capotraste para guitarra",
          sortOrder: 7,
        },
        {
          name: "Correas",
          slug: "correas",
          description: "Correas para guitarra y bajo",
          sortOrder: 8,
        },
      ],
    },
    {
      name: "Otros Instrumentos",
      slug: "otros-instrumentos",
      description: "Otros instrumentos musicales",
      icon: "🎼",
      sortOrder: 6,
      children: [
        {
          name: "Ukuleles",
          slug: "ukuleles",
          description: "Ukuleles soprano, concierto, tenor y barítono",
          sortOrder: 1,
        },
        {
          name: "Mandolinas",
          slug: "mandolinas",
          description: "Mandolinas acústicas y eléctricas",
          sortOrder: 2,
        },
        {
          name: "Banjos",
          slug: "banjos",
          description: "Banjos de 4 y 5 cuerdas",
          sortOrder: 3,
        },
      ],
    },
  ],
  products: [
    // Guitarras Eléctricas - Stratocaster
    {
      nombre: "Fender Player Stratocaster",
      descripcion:
        "Guitarra eléctrica Stratocaster mexicana con pickups Player Series",
      precio: 15999,
      marca: "Fender",
      stock: 5,
      tipo: "Instrumento",
      categorySlug: "stratocaster",
      tags: ["fender", "stratocaster", "mexicana", "player"],
      imagenes: [
        "https://example.com/fender-player-strat-1.jpg",
        "https://example.com/fender-player-strat-2.jpg",
      ],
      tipoInstrumento: "Guitarra",
      categoria: "Electrico",
      numeroCuerdas: 6,
      materialCuerpo: "Aliso",
      materialMastil: "Arce",
      materialDiapason: "Arce",
    },
    {
      nombre: "Squier Classic Vibe 60s Stratocaster",
      descripcion: "Stratocaster inspirada en los modelos de los 60s",
      precio: 8999,
      marca: "Squier",
      stock: 8,
      tipo: "Instrumento",
      categorySlug: "stratocaster",
      tags: ["squier", "classic-vibe", "vintage", "60s"],
      imagenes: ["https://example.com/squier-cv-strat.jpg"],
      tipoInstrumento: "Guitarra",
      categoria: "Electrico",
      numeroCuerdas: 6,
      materialCuerpo: "Álamo",
      materialDiapason: "Laurel",
    },
    // Les Paul
    {
      nombre: "Epiphone Les Paul Standard 50s",
      descripcion: "Les Paul clásica con sonido vintage de los 50s",
      precio: 12999,
      marca: "Epiphone",
      stock: 4,
      tipo: "Instrumento",
      categorySlug: "les-paul",
      tags: ["epiphone", "les-paul", "standard", "vintage"],
      imagenes: ["https://example.com/epiphone-lp-standard.jpg"],
      tipoInstrumento: "Guitarra",
      categoria: "Electrico",
      numeroCuerdas: 6,
      materialCuerpo: "Caoba",
      materialMastil: "Caoba",
      materialDiapason: "Laurel",
    },
    // Telecaster
    {
      nombre: "Fender Player Telecaster",
      descripcion: "Telecaster mexicana con el sonido clásico twangy",
      precio: 16999,
      marca: "Fender",
      stock: 6,
      tipo: "Instrumento",
      categorySlug: "telecaster",
      tags: ["fender", "telecaster", "player", "twang"],
      imagenes: ["https://example.com/fender-player-tele.jpg"],
      tipoInstrumento: "Guitarra",
      categoria: "Electrico",
      numeroCuerdas: 6,
      materialCuerpo: "Aliso",
      materialDiapason: "Arce",
    },
    // Guitarras Acústicas
    {
      nombre: "Yamaha FG830",
      descripcion: "Guitarra acústica folk con tapa sólida de abeto",
      precio: 5999,
      marca: "Yamaha",
      stock: 10,
      tipo: "Instrumento",
      categorySlug: "folk",
      tags: ["yamaha", "acustica", "folk", "tapa-solida"],
      imagenes: ["https://example.com/yamaha-fg830.jpg"],
      tipoInstrumento: "Guitarra",
      categoria: "Acustico",
      numeroCuerdas: 6,
      materialCuerpo: "Abeto/Palisandro",
      materialMastil: "Nato",
      materialDiapason: "Palisandro",
    },
    {
      nombre: "Taylor Academy 10",
      descripcion: "Guitarra acústica dreadnought perfecta para principiantes",
      precio: 8999,
      marca: "Taylor",
      stock: 3,
      tipo: "Instrumento",
      categorySlug: "dreadnought",
      tags: ["taylor", "academy", "principiante", "dreadnought"],
      imagenes: ["https://example.com/taylor-academy-10.jpg"],
      tipoInstrumento: "Guitarra",
      categoria: "Acustico",
      numeroCuerdas: 6,
      materialCuerpo: "Koa Laminado",
      materialDiapason: "Eucalipto",
    },
    // Bajos
    {
      nombre: "Fender Player Precision Bass",
      descripcion: "Bajo eléctrico Precision Bass mexicano",
      precio: 18999,
      marca: "Fender",
      stock: 4,
      tipo: "Instrumento",
      categorySlug: "bajos-4-cuerdas",
      tags: ["fender", "precision", "bajo", "player"],
      imagenes: ["https://example.com/fender-p-bass.jpg"],
      tipoInstrumento: "Bajo",
      categoria: "Electrico",
      numeroCuerdas: 4,
      materialCuerpo: "Aliso",
      materialDiapason: "Arce",
    },
    {
      nombre: "Ibanez SR505",
      descripcion: "Bajo de 5 cuerdas con electrónicos activos",
      precio: 15999,
      marca: "Ibanez",
      stock: 2,
      tipo: "Instrumento",
      categorySlug: "bajos-5-cuerdas",
      tags: ["ibanez", "sr", "5-cuerdas", "activo"],
      imagenes: ["https://example.com/ibanez-sr505.jpg"],
      tipoInstrumento: "Bajo",
      categoria: "Electrico",
      numeroCuerdas: 5,
      materialCuerpo: "Caoba",
    },
    // Amplificadores
    {
      nombre: "Fender Blues Junior IV",
      descripcion: "Amplificador combo valvular de 15W para guitarra",
      precio: 12999,
      marca: "Fender",
      stock: 3,
      tipo: "Equipo",
      categorySlug: "combos-guitarra",
      tags: ["fender", "blues-junior", "valvular", "combo"],
      imagenes: ["https://example.com/fender-blues-jr.jpg"],
      tipoEquipo: "Amplificador",
      potencia: 15,
      especificaciones: {
        tipoAmplificador: "Combo",
      },
    },
    {
      nombre: "Marshall CODE 50",
      descripcion: "Amplificador combo digital de 50W con efectos integrados",
      precio: 8999,
      marca: "Otros", // Marshall no está en el enum, usamos "Otros"
      stock: 5,
      tipo: "Equipo",
      categorySlug: "combos-guitarra",
      tags: ["marshall", "code", "digital", "efectos"],
      imagenes: ["https://example.com/marshall-code50.jpg"],
      tipoEquipo: "Amplificador",
      potencia: 50,
      especificaciones: {
        tipoAmplificador: "Combo",
      },
    },
    // Efectos
    {
      nombre: "Boss DS-1 Distortion",
      descripcion: "Pedal de distorsión clásico de Boss",
      precio: 2499,
      marca: "Otros", // Boss no está en el enum
      stock: 15,
      tipo: "Equipo",
      categorySlug: "distorsion",
      tags: ["boss", "ds1", "distorsion", "overdrive"],
      imagenes: ["https://example.com/boss-ds1.jpg"],
      tipoEquipo: "Efecto",
      especificaciones: {
        tipoEfecto: "Distorsión",
      },
    },
    {
      nombre: "Strymon Timeline",
      descripcion:
        "Pedal de delay digital profesional con múltiples algoritmos",
      precio: 12999,
      marca: "Otros", // Strymon no está en el enum
      stock: 2,
      tipo: "Equipo",
      categorySlug: "delay",
      tags: ["strymon", "timeline", "delay", "profesional"],
      imagenes: ["https://example.com/strymon-timeline.jpg"],
      tipoEquipo: "Efecto",
      especificaciones: {
        tipoEfecto: "Delay",
      },
    },
    // Accesorios
    {
      nombre: "Elixir Nanoweb Light 010-046",
      descripcion: "Cuerdas para guitarra eléctrica con recubrimiento Nanoweb",
      precio: 549,
      marca: "Elixir",
      stock: 25,
      tipo: "Accesorio",
      categorySlug: "cuerdas-guitarra-electrica",
      tags: ["elixir", "nanoweb", "cuerdas", "electrica"],
      imagenes: ["https://example.com/elixir-nanoweb.jpg"],
      tipoAccesorio: "Cuerdas Guitarra Electrica",
    },
    {
      nombre: "D'Addario EJ16 Phosphor Bronze",
      descripcion: "Cuerdas de bronce fosforado para guitarra acústica",
      precio: 299,
      marca: "Otros", // D'Addario no está en el enum
      stock: 30,
      tipo: "Accesorio",
      categorySlug: "cuerdas-guitarra-acustica",
      tags: ["daddario", "phosphor-bronze", "acustica"],
      imagenes: ["https://example.com/daddario-ej16.jpg"],
      tipoAccesorio: "Cuerdas Guitarra Acustica",
    },
    {
      nombre: "Fender Professional Series Cable 18.6ft",
      descripcion: "Cable profesional para instrumentos de 18.6 pies",
      precio: 899,
      marca: "Fender",
      stock: 20,
      tipo: "Accesorio",
      categorySlug: "cables",
      tags: ["fender", "cable", "profesional", "18-pies"],
      imagenes: ["https://example.com/fender-cable.jpg"],
      tipoAccesorio: "Cables",
    },
    {
      nombre: "Dunlop Tortex Standard 0.73mm",
      descripcion: "Púas Tortex estándar de 0.73mm (pack de 12)",
      precio: 189,
      marca: "Dunlop",
      stock: 50,
      tipo: "Accesorio",
      categorySlug: "puas",
      tags: ["dunlop", "tortex", "puas", "073mm"],
      imagenes: ["https://example.com/dunlop-tortex.jpg"],
      tipoAccesorio: "Puas",
    },
    {
      nombre: "Snark SN-5X Tuner",
      descripcion: "Afinador cromático de clip ultra preciso",
      precio: 649,
      marca: "Snark",
      stock: 15,
      tipo: "Accesorio",
      categorySlug: "afinadores-metronomos",
      tags: ["snark", "afinador", "clip", "cromatico"],
      imagenes: ["https://example.com/snark-sn5x.jpg"],
      tipoAccesorio: "Afinadores & Metronomos",
    },
  ],
};

// Helper function to create categories recursively
async function createCategoriesRecursive(
  categories,
  parentId = null,
  level = 0,
) {
  const createdCategories = [];

  for (const categoryData of categories) {
    const { children, ...categoryInfo } = categoryData;

    const category = new Category({
      ...categoryInfo,
      parent: parentId,
      level: level,
    });

    await category.save();
    console.log(`Created category: ${category.name} (Level ${level})`);
    createdCategories.push(category);

    // Create children recursively
    if (children && children.length > 0) {
      await createCategoriesRecursive(children, category._id, level + 1);
    }
  }

  return createdCategories;
}

// Helper function to find category by slug
async function findCategoryBySlug(slug) {
  return await Category.findOne({ slug });
}

// Main seed function
async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...");

    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Producto.deleteMany({});
    await Category.deleteMany({});
    console.log("✅ Existing data cleared");

    // Create categories
    console.log("📁 Creating categories...");
    await createCategoriesRecursive(seedData.categories);
    console.log("✅ Categories created successfully");

    // Create products
    console.log("📦 Creating products...");
    const createdProducts = [];

    for (const productData of seedData.products) {
      const { categorySlug, ...productInfo } = productData;

      // Find the category by slug
      const category = await findCategoryBySlug(categorySlug);
      if (!category) {
        console.warn(
          `⚠️  Category with slug '${categorySlug}' not found for product '${productInfo.nombre}'`,
        );
        continue;
      }

      const product = new Producto({
        ...productInfo,
        category: category._id,
      });

      await product.save();
      console.log(
        `Created product: ${product.nombre} in category: ${category.name}`,
      );
      createdProducts.push(product);
    }

    // Update product counts for categories
    console.log("🔢 Updating product counts...");
    await Category.updateProductCounts();

    // Create a test admin user if it doesn't exist
    console.log("👤 Creating test admin user...");
    const existingAdmin = await User.findOne({
      email: "admin@elmundodelasguitarras.com",
    });
    if (!existingAdmin) {
      const adminUser = new User({
        username: "admin",
        email: "admin@elmundodelasguitarras.com",
        password: "admin123", // This will be hashed by the pre-save middleware
        role: "Admin",
        firstName: "Admin",
        lastName: "User",
        isActive: true,
      });
      await adminUser.save();
      console.log(
        "✅ Admin user created: admin@elmundodelasguitarras.com / admin123",
      );
    } else {
      console.log("ℹ️  Admin user already exists");
    }

    console.log("\n🎉 Database seeded successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Categories created: ${await Category.countDocuments()}`);
    console.log(`   - Products created: ${await Producto.countDocuments()}`);
    console.log(`   - Users: ${await User.countDocuments()}`);

    // Show category tree
    console.log("\n🌳 Category Tree:");
    const rootCategories = await Category.getRootCategories();
    for (const root of rootCategories) {
      await printCategoryTree(root, 0);
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Helper function to print category tree
async function printCategoryTree(category, depth = 0) {
  const indent = "  ".repeat(depth);
  const productCount = await Producto.countDocuments({
    category: category._id,
  });
  console.log(`${indent}- ${category.name} (${productCount} products)`);

  if (category.children && category.children.length > 0) {
    const children = await Category.find({ parent: category._id }).sort({
      sortOrder: 1,
    });
    for (const child of children) {
      await printCategoryTree(child, depth + 1);
    }
  }
}

// Run the seed function if this script is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("✅ Seed completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seed failed:", error);
      process.exit(1);
    });
}

module.exports = {
  seedDatabase,
  seedData,
};
