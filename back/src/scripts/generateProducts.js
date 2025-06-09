const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const { Producto } = require("../models");

// Get discriminator models
const Instrumento = Producto.discriminators.Instrumento;
const Equipo = Producto.discriminators.Equipo;
const Accesorio = Producto.discriminators.Accesorio;

// Sample image URLs (you can replace these with actual image URLs)
const getRandomImages = () => {
  const imageUrls = [
    "https://gamamusic.com/cdn/shop/files/0374083505-2.webp?v=1748387121&width=500",
    "https://gamamusic.com/cdn/shop/files/9236091144-9.webp?v=1749056612&width=500",
    "https://gamamusic.com/cdn/shop/files/0266240560-2.webp?v=1748386708&width=500",
    "https://gamamusic.com/cdn/shop/files/CBEG20-1.jpg?v=1693873064&width=400",
    "https://gamamusic.com/cdn/shop/files/0990510156-1.webp?v=1731367704&width=400",
    "https://gamamusic.com/cdn/shop/files/SR605ECTF-1.jpg?v=1690411046&width=400",
    "https://gamamusic.com/cdn/shop/files/A48441-1.jpg?v=1692917309&width=400",
    "https://gamamusic.com/cdn/shop/files/ZLX12PG2-1_44a35472-b44a-4f85-80d7-0bd8e282d2a9.webp?v=1725381960&width=400",
    "https://gamamusic.com/cdn/shop/files/EK50-2.webp?v=1727721853&width=400",
    "https://gamamusic.com/cdn/shop/files/AMVL008-00.jpg?v=1690318577&width=400",
    "https://gamamusic.com/cdn/shop/files/RDP2F5BLGUSET-1.jpg?v=1692916313&width=400",
  ];

  const numImages = Math.floor(Math.random() * 3) + 1; // 1-3 images
  const selectedImages = [];
  for (let i = 0; i < numImages; i++) {
    selectedImages.push(
      imageUrls[Math.floor(Math.random() * imageUrls.length)],
    );
  }
  return selectedImages;
};

// Helper functions
const getRandomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];
const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomPrice = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Guitar data
const guitarData = {
  electricGuitars: [
    {
      nombre: "Stratocaster American Professional II",
      marca: "Fender",
      precio: 28999,
      subcategoria: "Stratocaster",
    },
    {
      nombre: "Player Stratocaster",
      marca: "Fender",
      precio: 15999,
      subcategoria: "Stratocaster",
    },
    {
      nombre: "Classic Vibe '60s Stratocaster",
      marca: "Squier",
      precio: 8999,
      subcategoria: "Stratocaster",
    },
    {
      nombre: "Player Telecaster",
      marca: "Fender",
      precio: 16999,
      subcategoria: "Telecaster",
    },
    {
      nombre: "American Ultra Telecaster",
      marca: "Fender",
      precio: 35999,
      subcategoria: "Telecaster",
    },
    {
      nombre: "Les Paul Standard 50s",
      marca: "Epiphone",
      precio: 12999,
      subcategoria: "Les Paul",
    },
    {
      nombre: "SG Standard",
      marca: "Epiphone",
      precio: 9999,
      subcategoria: "SG",
    },
    { nombre: "RG421", marca: "Ibanez", precio: 7999, subcategoria: "Otro" },
    {
      nombre: "Dinky JS22",
      marca: "Jackson",
      precio: 6999,
      subcategoria: "Otro",
    },
    { nombre: "EC-256", marca: "LTD", precio: 8499, subcategoria: "Les Paul" },
  ],
  acousticGuitars: [
    {
      nombre: "CD-60S",
      marca: "Fender",
      precio: 4999,
      subcategoria: "Dreadnought",
    },
    {
      nombre: "FA-115",
      marca: "Fender",
      precio: 3499,
      subcategoria: "Dreadnought",
    },
    { nombre: "F310", marca: "Yamaha", precio: 2899, subcategoria: "Folk" },
    { nombre: "FG830", marca: "Yamaha", precio: 5999, subcategoria: "Folk" },
    { nombre: "C40", marca: "Yamaha", precio: 2499, subcategoria: "Clásica" },
    {
      nombre: "Dreadnought Junior",
      marca: "Taylor",
      precio: 12999,
      subcategoria: "Dreadnought",
    },
    {
      nombre: "GC1 Classical",
      marca: "Yamaha",
      precio: 3999,
      subcategoria: "Clásica",
    },
    {
      nombre: "Redondo Player",
      marca: "Fender",
      precio: 6999,
      subcategoria: "Folk",
    },
  ],
  basses: [
    {
      nombre: "Player Jazz Bass",
      marca: "Fender",
      precio: 18999,
      subcategoria: "Jazz Bass",
    },
    {
      nombre: "Player Precision Bass",
      marca: "Fender",
      precio: 17999,
      subcategoria: "Precision Bass",
    },
    {
      nombre: "Classic Vibe '60s Jazz Bass",
      marca: "Squier",
      precio: 9999,
      subcategoria: "Jazz Bass",
    },
    {
      nombre: "Thunderbird",
      marca: "Epiphone",
      precio: 11999,
      subcategoria: "Otro",
    },
    { nombre: "GSR180", marca: "Ibanez", precio: 5999, subcategoria: "Otro" },
    {
      nombre: "SR300E",
      marca: "Ibanez",
      precio: 12999,
      subcategoria: "Active Bass",
    },
  ],
};

// Equipment data
const equipmentData = {
  amplificadores: [
    {
      nombre: "Champion 20",
      marca: "Fender",
      precio: 3999,
      tipo: "Combo",
      tecnologia: "Estado Sólido",
    },
    {
      nombre: "Frontman 10G",
      marca: "Fender",
      precio: 1999,
      tipo: "Combo",
      tecnologia: "Estado Sólido",
    },
    {
      nombre: "Blues Junior IV",
      marca: "Fender",
      precio: 12999,
      tipo: "Combo",
      tecnologia: "Tubos",
    },
    {
      nombre: "Hot Rod DeVille 212 IV",
      marca: "Fender",
      precio: 21999,
      tipo: "Combo",
      tecnologia: "Tubos",
    },
    {
      nombre: "Katana-50 MkII",
      marca: "Otros",
      precio: 8999,
      tipo: "Combo",
      tecnologia: "Modelado Digital",
    },
    {
      nombre: "THR10II",
      marca: "Yamaha",
      precio: 7999,
      tipo: "Combo",
      tecnologia: "Modelado Digital",
    },
    {
      nombre: "V-Stack",
      marca: "Behringer",
      precio: 15999,
      tipo: "Cabezal",
      tecnologia: "Estado Sólido",
    },
  ],
  efectos: [
    {
      nombre: "Big Muff Pi",
      marca: "Otros",
      precio: 2999,
      tipo: "Fuzz",
      formato: "Pedal",
    },
    {
      nombre: "TS9 Tube Screamer",
      marca: "Otros",
      precio: 3999,
      tipo: "Overdrive",
      formato: "Pedal",
    },
    {
      nombre: "DD-7 Digital Delay",
      marca: "Otros",
      precio: 4999,
      tipo: "Delay",
      formato: "Pedal",
    },
    {
      nombre: "Holy Grail Reverb",
      marca: "Otros",
      precio: 3499,
      tipo: "Reverb",
      formato: "Pedal",
    },
    {
      nombre: "Crybaby Wah",
      marca: "Dunlop",
      precio: 2799,
      tipo: "Wah",
      formato: "Pedal",
    },
    {
      nombre: "Phase 90",
      marca: "Otros",
      precio: 3299,
      tipo: "Phaser",
      formato: "Pedal",
    },
    {
      nombre: "Dyna Comp",
      marca: "Otros",
      precio: 2899,
      tipo: "Compresor",
      formato: "Pedal",
    },
    {
      nombre: "Multi-Effects Processor",
      marca: "Behringer",
      precio: 4999,
      tipo: "Multiefectos",
      formato: "Pedalera",
    },
  ],
};

// Accessory data
const accessoryData = {
  cuerdas: [
    {
      nombre: "Extra Light Acoustic Strings",
      marca: "Elixir",
      precio: 599,
      tipo: "Cuerdas Guitarra Acustica",
      calibre: "10-47",
    },
    {
      nombre: "Light Electric Strings",
      marca: "Elixir",
      precio: 499,
      tipo: "Cuerdas Guitarra Electrica",
      calibre: "9-42",
    },
    {
      nombre: "Medium Acoustic Strings",
      marca: "Elixir",
      precio: 649,
      tipo: "Cuerdas Guitarra Acustica",
      calibre: "12-53",
    },
    {
      nombre: "Heavy Electric Strings",
      marca: "Elixir",
      precio: 549,
      tipo: "Cuerdas Guitarra Electrica",
      calibre: "10-46",
    },
    {
      nombre: "Bass Strings",
      marca: "Elixir",
      precio: 899,
      tipo: "Cuerdas Guitarra Electrica",
      calibre: "45-105",
    },
  ],
  accesorios: [
    {
      nombre: "Guitar Stand",
      marca: "Otros",
      precio: 299,
      tipo: "Atriles & Soportes",
    },
    {
      nombre: "Clip-On Tuner",
      marca: "Snark",
      precio: 399,
      tipo: "Afinadores & Metronomos",
    },
    { nombre: "Guitar Cable 6m", marca: "Otros", precio: 199, tipo: "Cables" },
    {
      nombre: "Acoustic Guitar Capo",
      marca: "Dunlop",
      precio: 249,
      tipo: "Capos",
    },
    { nombre: "Delrin Pick Set", marca: "Dunlop", precio: 89, tipo: "Puas" },
    { nombre: "Guitar Strap", marca: "Otros", precio: 199, tipo: "Correa" },
    {
      nombre: "Guitar Polish & Cloth",
      marca: "Dunlop",
      precio: 149,
      tipo: "Herramientas & Limpiadores",
    },
    {
      nombre: "Acoustic Gig Bag",
      marca: "Fender",
      precio: 1299,
      tipo: "Fundas & Estuches",
    },
    {
      nombre: "Electric Hard Case",
      marca: "Fender",
      precio: 3999,
      tipo: "Fundas & Estuches",
    },
  ],
};

// Generate instruments
async function generateInstruments() {
  const instruments = [];

  // Electric Guitars
  for (let i = 0; i < 50; i++) {
    const guitar = getRandomElement(guitarData.electricGuitars);
    const colors = [
      "Sunburst",
      "Black",
      "White",
      "Red",
      "Blue",
      "Natural",
      "Surf Green",
    ];
    const materials = ["Alder", "Ash", "Mahogany", "Basswood", "Poplar"];
    const neckMaterials = ["Maple", "Mahogany", "Roasted Maple"];
    const fretboardMaterials = ["Rosewood", "Maple", "Ebony", "Pau Ferro"];

    instruments.push({
      ...guitar,
      tipo: "Instrumento",
      categoria: "Electrico",
      tipoInstrumento: "Guitarra",
      categoriaProducto: "Guitarras Electricas",
      subcategoriaInstrumento: guitar.subcategoria,
      descripcion: `Guitarra eléctrica ${guitar.nombre} en excelente estado`,
      stock: getRandomNumber(0, 20),
      imagenes: getRandomImages(),
      materialCuerpo: getRandomElement(materials),
      materialMastil: getRandomElement(neckMaterials),
      materialDiapason: getRandomElement(fretboardMaterials),
      numeroCuerdas: 6,
      color: getRandomElement(colors),
      incluyeEstuche: Math.random() > 0.5,
      especificacionesGuitarra: {
        serie: "Standard",
        escala: '25.5"',
        cantidadTrastes: getRandomNumber(21, 24),
        tipoPastillas: getRandomElement(["Humbucker", "Single-coil", "P90"]),
        cantidadPastillas: getRandomNumber(2, 3),
        configuracionPastillas: getRandomElement(["HSS", "HH", "SSS", "HSH"]),
        controlVolumen: 1,
        controlTono: getRandomNumber(1, 2),
        selector: "5 posiciones",
        tipoPuente: getRandomElement(["Tremolo", "Fixed", "Floyd Rose"]),
        acabado: "Polyurethane",
        paisFabricacion: getRandomElement([
          "USA",
          "Mexico",
          "China",
          "Indonesia",
        ]),
        añoModelo: getRandomNumber(2020, 2024),
      },
    });
  }

  // Acoustic Guitars
  for (let i = 0; i < 30; i++) {
    const guitar = getRandomElement(guitarData.acousticGuitars);
    const colors = ["Natural", "Sunburst", "Black", "Vintage Tint"];

    instruments.push({
      ...guitar,
      tipo: "Instrumento",
      categoria: "Acustico",
      tipoInstrumento: "Guitarra",
      categoriaProducto: "Guitarras Acusticas",
      subcategoriaInstrumento: guitar.subcategoria,
      descripcion: `Guitarra acústica ${guitar.nombre} perfecta para principiantes y profesionales`,
      stock: getRandomNumber(0, 15),
      imagenes: getRandomImages(),
      materialCuerpo: getRandomElement([
        "Spruce",
        "Cedar",
        "Mahogany",
        "Sapele",
      ]),
      materialMastil: "Mahogany",
      materialDiapason: getRandomElement(["Rosewood", "Laurel", "Ebony"]),
      numeroCuerdas: 6,
      color: getRandomElement(colors),
      incluyeEstuche: Math.random() > 0.3,
      especificacionesGuitarra: {
        serie: "Standard",
        escala: '25.3"',
        cantidadTrastes: 20,
        cantidadPastillas: 0,
        controlVolumen: 0,
        controlTono: 0,
        tipoPuente: "Fixed",
        acabado: "Satin",
        paisFabricacion: getRandomElement(["USA", "Mexico", "China"]),
        añoModelo: getRandomNumber(2020, 2024),
      },
    });
  }

  // Basses
  for (let i = 0; i < 20; i++) {
    const bass = getRandomElement(guitarData.basses);
    const colors = ["Sunburst", "Black", "White", "Red", "Natural"];

    instruments.push({
      ...bass,
      tipo: "Instrumento",
      categoria:
        bass.subcategoria === "Active Bass" ? "Electrico" : "Electrico",
      tipoInstrumento: "Bajo",
      categoriaProducto: "Bajos",
      subcategoriaInstrumento: bass.subcategoria,
      descripcion: `Bajo eléctrico ${bass.nombre} con sonido profesional`,
      stock: getRandomNumber(0, 10),
      imagenes: getRandomImages(),
      materialCuerpo: getRandomElement(["Alder", "Ash", "Mahogany"]),
      materialMastil: "Maple",
      materialDiapason: getRandomElement(["Rosewood", "Maple", "Ebony"]),
      numeroCuerdas: 4,
      color: getRandomElement(colors),
      incluyeEstuche: Math.random() > 0.4,
      especificacionesGuitarra: {
        serie: "Standard",
        escala: '34"',
        cantidadTrastes: getRandomNumber(20, 24),
        tipoPastillas: getRandomElement(["Humbucker", "Single-coil"]),
        cantidadPastillas: 2,
        configuracionPastillas: "PJ",
        controlVolumen: 2,
        controlTono: 1,
        selector: "3 posiciones",
        tipoPuente: "Fixed",
        acabado: "Polyurethane",
        paisFabricacion: getRandomElement(["USA", "Mexico", "China"]),
        añoModelo: getRandomNumber(2020, 2024),
      },
    });
  }

  return instruments;
}

// Generate equipment
async function generateEquipment() {
  const equipment = [];

  // Amplifiers
  for (let i = 0; i < 40; i++) {
    const amp = getRandomElement(equipmentData.amplificadores);

    equipment.push({
      ...amp,
      tipo: "Equipo",
      tipoEquipo: "Amplificador",
      categoriaProducto: "Amplificadores",
      descripcion: `Amplificador ${amp.nombre} perfecto para estudio y presentaciones`,
      stock: getRandomNumber(0, 15),
      imagenes: getRandomImages(),
      potencia: getRandomNumber(10, 100),
      entradas: getRandomNumber(1, 4),
      salidas: getRandomNumber(1, 3),
      caracteristicasAdicionales:
        "Incluye efectos incorporados y conectividad USB",
      especificacionesAmplificador: {
        tipo: amp.tipo,
        tecnologia: amp.tecnologia,
        cantidadCanales: getRandomNumber(1, 4),
        tamañoAltavoz: getRandomElement([
          "8 pulgadas",
          "10 pulgadas",
          "12 pulgadas",
          "2x12 pulgadas",
        ]),
        efectosIncorporados: getRandomElement([
          ["Reverb", "Delay"],
          ["Chorus", "Tremolo", "Reverb"],
          ["Distortion", "Overdrive", "Reverb", "Delay"],
          [],
        ]),
        impedancia: getRandomElement(["4 Ohms", "8 Ohms", "16 Ohms"]),
        uso: getRandomElement([
          "Estudio",
          "Práctica",
          "Conciertos pequeños",
          "Conciertos grandes",
        ]),
      },
    });
  }

  // Effects
  for (let i = 0; i < 60; i++) {
    const effect = getRandomElement(equipmentData.efectos);

    equipment.push({
      ...effect,
      tipo: "Equipo",
      tipoEquipo: "Efecto",
      categoriaProducto: "Efectos",
      descripcion: `Pedal de efecto ${effect.nombre} para guitarristas exigentes`,
      stock: getRandomNumber(0, 25),
      imagenes: getRandomImages(),
      caracteristicasAdicionales: "True bypass, construcción robusta",
      especificacionesEfecto: {
        tipoEfecto: effect.tipo,
        formato: effect.formato,
        alimentacion: getRandomElement(["Baterías", "Adaptador DC", "Ambos"]),
        controles: getRandomElement([
          ["Level", "Drive"],
          ["Level", "Tone", "Drive"],
          ["Mix", "Time", "Feedback"],
          ["Volume", "Tone"],
        ]),
        bypass: getRandomElement(["True Bypass", "Buffered"]),
      },
    });
  }

  return equipment;
}

// Generate accessories
async function generateAccessories() {
  const accessories = [];

  // Strings
  for (let i = 0; i < 30; i++) {
    const string = getRandomElement(accessoryData.cuerdas);

    accessories.push({
      ...string,
      tipo: "Accesorio",
      tipoAccesorio: string.tipo,
      categoriaProducto: "Accesorios",
      subcategoriaAccesorio: string.tipo,
      descripcion: `Cuerdas de alta calidad ${string.nombre}`,
      stock: getRandomNumber(10, 100),
      imagenes: getRandomImages(),
      compatibilidad: string.tipo.includes("Acustica")
        ? "Guitarra Acústica"
        : "Guitarra Eléctrica",
      especificacionesCuerdas: {
        calibre: string.calibre,
        material: getRandomElement([
          "Níquel",
          "Acero inoxidable",
          "Bronce",
          "Phosphor Bronze",
        ]),
        recubrimiento: Math.random() > 0.5,
        tipoRecubrimiento: "Nanoweb",
        cantidadCuerdas: 6,
      },
    });
  }

  // Other accessories
  for (let i = 0; i < 100; i++) {
    const accessory = getRandomElement(accessoryData.accesorios);

    accessories.push({
      ...accessory,
      tipo: "Accesorio",
      tipoAccesorio: accessory.tipo,
      categoriaProducto: "Accesorios",
      subcategoriaAccesorio: accessory.tipo,
      descripcion: `${accessory.nombre} - Accesorio esencial para todo músico`,
      stock: getRandomNumber(5, 50),
      imagenes: getRandomImages(),
      compatibilidad: "Universal",
      color: getRandomElement(["Black", "Natural", "Brown", "Red", "Blue"]),
      material: getRandomElement([
        "Plastic",
        "Metal",
        "Leather",
        "Nylon",
        "Wood",
      ]),
    });
  }

  return accessories;
}

// Main function to generate all products
async function generateAllProducts() {
  try {
    console.log("Connecting to MongoDB...");
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGO_URI_LOCAL ||
      "mongodb://localhost:27017/fs1-store";
    console.log(
      `Using MongoDB URI: ${mongoUri.replace(/\/\/[^@]*@/, "//***:***@")}`,
    );
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully!");

    console.log("Clearing existing products...");
    await Producto.deleteMany({});

    console.log("Generating instruments...");
    const instruments = await generateInstruments();

    console.log("Generating equipment...");
    const equipment = await generateEquipment();

    console.log("Generating accessories...");
    const accessories = await generateAccessories();

    console.log("Saving instruments to database...");
    const savedInstruments = await Instrumento.insertMany(instruments);
    console.log(`✅ Created ${savedInstruments.length} instruments`);

    console.log("Saving equipment to database...");
    const savedEquipment = await Equipo.insertMany(equipment);
    console.log(`✅ Created ${savedEquipment.length} equipment items`);

    console.log("Saving accessories to database...");
    const savedAccessories = await Accesorio.insertMany(accessories);
    console.log(`✅ Created ${savedAccessories.length} accessories`);

    const totalProducts =
      savedInstruments.length + savedEquipment.length + savedAccessories.length;
    console.log(`\n🎉 Successfully generated ${totalProducts} products!`);

    // Display summary
    console.log("\n📊 Summary:");
    console.log(`• Instruments: ${savedInstruments.length}`);
    console.log(`• Equipment: ${savedEquipment.length}`);
    console.log(`• Accessories: ${savedAccessories.length}`);
    console.log(`• Total: ${totalProducts}`);
  } catch (error) {
    console.error("❌ Error generating products:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the script
if (require.main === module) {
  generateAllProducts();
}

module.exports = { generateAllProducts };
