require("dotenv").config();
const mongoose = require("mongoose");
const { Producto } = require("../src/models");

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB successfully!");

    // Clear existing data
    await Producto.deleteMany({});
    console.log("Cleared existing products");

    // Seed Instrumentos (Guitars, Basses, etc.)
    const instrumentos = [
      {
        nombre: "Stratocaster Standard",
        descripcion:
          "Guitarra eléctrica con cuerpo de aliso y mástil de arce. Perfecta para diversos estilos musicales.",
        precio: 899.99,
        marca: "Fender",
        stock: 15,
        tipo: "Instrumento",
        imagenes: ["strat1.jpg", "strat2.jpg"],
        categoria: "Electrico",
        tipoInstrumento: "Guitarra",
        materialCuerpo: "Aliso",
        materialMastil: "Arce",
        numeroCuerdas: 6,
        color: "Sunburst",
        incluyeEstuche: false,
      },
      {
        nombre: "Les Paul Standard",
        descripcion:
          "Guitarra eléctrica con cuerpo de caoba y tapa de arce. Sonido clásico y potente.",
        precio: 1999.99,
        marca: "Gibson",
        stock: 8,
        tipo: "Instrumento",
        imagenes: ["lespaul1.jpg", "lespaul2.jpg"],
        categoria: "Electrico",
        tipoInstrumento: "Guitarra",
        materialCuerpo: "Caoba",
        materialMastil: "Caoba",
        numeroCuerdas: 6,
        color: "Cherry Sunburst",
        incluyeEstuche: true,
      },
      {
        nombre: "D-28",
        descripcion:
          "Guitarra acústica premium con cuerpo de palosanto y tapa de abeto. Sonido rico y potente.",
        precio: 2899.99,
        marca: "Martin",
        stock: 5,
        tipo: "Instrumento",
        imagenes: ["d28.jpg"],
        categoria: "Acustico",
        tipoInstrumento: "Guitarra",
        materialCuerpo: "Palosanto",
        materialMastil: "Caoba",
        numeroCuerdas: 6,
        color: "Natural",
        incluyeEstuche: true,
      },
      {
        nombre: "Jazz Bass",
        descripcion: "Bajo eléctrico versátil con sonido clásico y moderno.",
        precio: 1299.99,
        marca: "Fender",
        stock: 10,
        tipo: "Instrumento",
        imagenes: ["jazzbass.jpg"],
        categoria: "Electrico",
        tipoInstrumento: "Bajo",
        materialCuerpo: "Aliso",
        materialMastil: "Arce",
        numeroCuerdas: 4,
        color: "Negro",
        incluyeEstuche: false,
      },
    ];

    // Seed Equipos (Audio equipment)
    const equipos = [
      {
        nombre: "Blues Junior",
        descripcion:
          "Amplificador de guitarra a tubos de 15W con sonido clásico Fender.",
        precio: 749.99,
        marca: "Fender",
        stock: 12,
        tipo: "Equipo",
        imagenes: ["bluesjr.jpg"],
        tipoEquipo: "Amplificador",
        potencia: 15,
        entradas: 2,
        salidas: 1,
        caracteristicasAdicionales: "Reverb de resorte, tubos 12AX7 y EL84",
      },
      {
        nombre: "Signature Mixer",
        descripcion:
          "Mezcladora compacta de 12 canales con efectos integrados.",
        precio: 399.99,
        marca: "Behringer",
        stock: 8,
        tipo: "Equipo",
        imagenes: ["mixer.jpg"],
        tipoEquipo: "Mezcladora",
        potencia: 0,
        entradas: 12,
        salidas: 6,
        caracteristicasAdicionales:
          "Conexión USB, efectos digitales, ecualizador paramétrico",
      },
    ];

    // Seed Accesorios (Accessories)
    const accesorios = [
      {
        nombre: "Cuerdas Elixir Nanoweb",
        descripcion:
          "Cuerdas de larga duración con recubrimiento Nanoweb, calibre 10-46.",
        precio: 14.99,
        marca: "Elixir",
        stock: 50,
        tipo: "Accesorio",
        imagenes: ["elixir.jpg"],
        tipoAccesorio: "Cuerdas",
        compatibilidad: "Guitarra eléctrica",
        color: "Plateado",
        material: "Níquel",
      },
      {
        nombre: "Afinador Clip-On",
        descripcion: "Afinador cromático de pinza con pantalla a color",
        precio: 19.99,
        marca: "Snark",
        stock: 35,
        tipo: "Accesorio",
        imagenes: ["afinador.jpg"],
        tipoAccesorio: "Afinador",
        compatibilidad: "Universal",
        color: "Negro",
        material: "Plástico",
      },
      {
        nombre: "Pack de Púas Tortex",
        descripcion: "Pack de 12 púas Tortex de diferentes calibres",
        precio: 5.99,
        marca: "Dunlop",
        stock: 100,
        tipo: "Accesorio",
        imagenes: ["puas.jpg"],
        tipoAccesorio: "Puas",
        compatibilidad: "Universal",
        color: "Variado",
        material: "Delrin",
      },
    ];

    // Insert all products
    const allProducts = [...instrumentos, ...equipos, ...accesorios];
    const inserted = await Producto.insertMany(allProducts);

    console.log(`¡Base de datos sembrada con éxito!`);
    console.log(`Insertados ${instrumentos.length} instrumentos`);
    console.log(`Insertados ${equipos.length} equipos de audio`);
    console.log(`Insertados ${accesorios.length} accesorios`);
    console.log(`Total: ${inserted.length} productos`);

    mongoose.connection.close();
    console.log("Conexión cerrada");
  } catch (error) {
    console.error("Error al sembrar la base de datos:", error);
    process.exit(1);
  }
};

seedDatabase();
