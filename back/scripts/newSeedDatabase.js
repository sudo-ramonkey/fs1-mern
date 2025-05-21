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

    // Seed Guitarras Eléctricas
    const guitarrasElectricas = [
      {
        nombre: "Stratocaster Professional II",
        descripcion: "Guitarra eléctrica Fender Stratocaster con pastillas V-Mod II y mástil de arce.",
        precio: 1799.99,
        marca: "Fender",
        stock: 8,
        tipo: "Instrumento",
        categoriaProducto: "Guitarras Electricas",
        imagenes: ["strat_pro.jpg", "strat_pro_back.jpg"],
        categoria: "Electrico",
        tipoInstrumento: "Guitarra",
        materialCuerpo: "Aliso",
        materialMastil: "Arce",
        materialDiapason: "Arce",
        numeroCuerdas: 6,
        color: "Sunburst",
        incluyeEstuche: true,
        subcategoriaInstrumento: "Stratocaster",
        especificacionesGuitarra: {
          serie: "Professional II",
          modeloEspecifico: "American Professional II Stratocaster",
          escala: "25.5 pulgadas",
          cantidadTrastes: 22,
          tipoPastillas: "Single-coil",
          cantidadPastillas: 3,
          configuracionPastillas: "SSS",
          controlVolumen: 1,
          controlTono: 2,
          selector: "5 posiciones",
          tipoPuente: "Tremolo",
          acabado: "Gloss Polyurethane",
          paisFabricacion: "USA",
          añoModelo: 2022
        }
      },
      {
        nombre: "Les Paul Standard '60s",
        descripcion: "Guitarra eléctrica Gibson Les Paul con pastillas Burstbucker y acabado de alta calidad.",
        precio: 2499.99,
        marca: "Epiphone",
        stock: 5,
        tipo: "Instrumento",
        categoriaProducto: "Guitarras Electricas",
        imagenes: ["lespaul_standard.jpg"],
        categoria: "Electrico",
        tipoInstrumento: "Guitarra",
        materialCuerpo: "Caoba",
        materialMastil: "Caoba",
        materialDiapason: "Palisandro",
        numeroCuerdas: 6,
        color: "Cherry Sunburst",
        incluyeEstuche: true,
        subcategoriaInstrumento: "Les Paul",
        especificacionesGuitarra: {
          serie: "Standard '60s",
          modeloEspecifico: "Les Paul Standard '60s",
          escala: "24.75 pulgadas",
          cantidadTrastes: 22,
          tipoPastillas: "Humbucker",
          cantidadPastillas: 2,
          configuracionPastillas: "HH",
          controlVolumen: 2,
          controlTono: 2,
          selector: "3 posiciones",
          tipoPuente: "Tune-O-Matic",
          acabado: "Gloss",
          paisFabricacion: "China",
          añoModelo: 2021
        }
      },
      {
        nombre: "RG550 Genesis Collection",
        descripcion: "Guitarra eléctrica de alto rendimiento con puente Edge y mástil Super Wizard.",
        precio: 999.99,
        marca: "Ibanez",
        stock: 7,
        tipo: "Instrumento",
        categoriaProducto: "Guitarras Electricas",
        imagenes: ["ibanez_rg550.jpg"],
        categoria: "Electrico",
        tipoInstrumento: "Guitarra",
        materialCuerpo: "Aliso",
        materialMastil: "Arce",
        materialDiapason: "Arce",
        numeroCuerdas: 6,
        color: "Desert Sun Yellow",
        incluyeEstuche: false,
        subcategoriaInstrumento: "Otro",
        especificacionesGuitarra: {
          serie: "RG",
          modeloEspecifico: "RG550 Genesis Collection",
          escala: "25.5 pulgadas",
          cantidadTrastes: 24,
          tipoPastillas: "Humbucker",
          cantidadPastillas: 3,
          configuracionPastillas: "HSH",
          controlVolumen: 1,
          controlTono: 1,
          selector: "5 posiciones",
          tipoPuente: "Edge Tremolo",
          acabado: "Gloss",
          paisFabricacion: "Japón",
          añoModelo: 2022
        }
      }
    ];

    // Seed Guitarras Acústicas
    const guitarrasAcusticas = [
      {
        nombre: "D-28 Modern Deluxe",
        descripcion: "Guitarra acústica premium con cuerpo de palosanto y tapa de abeto Sitka.",
        precio: 3599.99,
        marca: "Otros",
        stock: 3,
        tipo: "Instrumento",
        categoriaProducto: "Guitarras Acusticas",
        imagenes: ["martin_d28.jpg"],
        categoria: "Acustico",
        tipoInstrumento: "Guitarra",
        materialCuerpo: "Palosanto",
        materialMastil: "Caoba",
        materialDiapason: "Ébano",
        numeroCuerdas: 6,
        color: "Natural",
        incluyeEstuche: true,
        subcategoriaInstrumento: "Dreadnought",
        especificacionesGuitarra: {
          serie: "Modern Deluxe",
          modeloEspecifico: "D-28 Modern Deluxe",
          escala: "25.4 pulgadas",
          cantidadTrastes: 20,
          paisFabricacion: "USA",
          añoModelo: 2022
        }
      }
    ];

    // Seed Amplificadores
    const amplificadores = [
      {
        nombre: "Blues Junior IV",
        descripcion: "Amplificador de guitarra a tubos de 15W con reverb de resorte.",
        precio: 749.99,
        marca: "Fender",
        stock: 10,
        tipo: "Equipo",
        categoriaProducto: "Amplificadores",
        imagenes: ["blues_junior.jpg"],
        tipoEquipo: "Amplificador",
        potencia: 15,
        entradas: 2,
        salidas: 1,
        caracteristicasAdicionales: "Reverb de resorte, EQ de 3 bandas",
        especificacionesAmplificador: {
          tipo: "Combo",
          tecnologia: "Tubos",
          cantidadCanales: 1,
          tamañoAltavoz: "12 pulgadas",
          tubos: {
            previo: "2x12AX7",
            potencia: "2xEL84"
          },
          efectosIncorporados: ["Reverb"],
          impedancia: "8 ohms",
          uso: "Práctica"
        }
      },
      {
        nombre: "MT-2 Metal Zone",
        descripcion: "Pedal de distorsión con controles de EQ de 3 bandas.",
        precio: 129.99,
        marca: "Otros",
        stock: 15,
        tipo: "Equipo",
        categoriaProducto: "Efectos",
        imagenes: ["boss_mt2.jpg"],
        tipoEquipo: "Efecto",
        entradas: 1,
        salidas: 1,
        caracteristicasAdicionales: "EQ paramétrico de 3 bandas",
        especificacionesEfecto: {
          tipoEfecto: "Distorsión",
          formato: "Pedal",
          alimentacion: "Baterías",
          controles: ["Level", "Distortion", "Low", "Mid", "High", "Mid Freq"],
          bypass: "Buffered"
        }
      }
    ];

    // Seed Accesorios
    const accesorios = [
      {
        nombre: "Elixir Nanoweb Electric",
        descripcion: "Cuerdas de larga duración con recubrimiento Nanoweb, calibre 10-46.",
        precio: 14.99,
        marca: "Otros",
        stock: 50,
        tipo: "Accesorio",
        categoriaProducto: "Accesorios",
        subcategoriaAccesorio: "Cuerdas Guitarra Electrica",
        imagenes: ["elixir_nanoweb.jpg"],
        tipoAccesorio: "Cuerdas Guitarra Electrica",
        compatibilidad: "Guitarra Eléctrica",
        color: "Plateado",
        material: "Níquel",
        especificacionesCuerdas: {
          calibre: "10-46",
          material: "Níquel",
          recubrimiento: true,
          tipoRecubrimiento: "Nanoweb",
          cantidadCuerdas: 6
        }
      },
      {
        nombre: "Clip-On Headstock Tuner",
        descripcion: "Afinador cromático con pantalla a color y sensor de vibración.",
        precio: 19.99,
        marca: "Otros",
        stock: 30,
        tipo: "Accesorio",
        categoriaProducto: "Accesorios",
        subcategoriaAccesorio: "Afinadores & Metronomos",
        imagenes: ["snark_tuner.jpg"],
        tipoAccesorio: "Afinadores & Metronomos",
        compatibilidad: "Universal",
        color: "Negro",
        material: "Plástico"
      },
      {
        nombre: "Púas Tortex Standard",
        descripcion: "Pack de 12 púas de diferentes grosores.",
        precio: 4.99,
        marca: "Otros",
        stock: 100,
        tipo: "Accesorio",
        categoriaProducto: "Accesorios",
        subcategoriaAccesorio: "Puas",
        imagenes: ["tortex_picks.jpg"],
        tipoAccesorio: "Puas",
        compatibilidad: "Universal",
        color: "Naranja/Amarillo/Rojo",
        material: "Delrin"
      },
      {
        nombre: "Funda Deluxe para Stratocaster",
        descripcion: "Funda acolchada resistente con compartimentos.",
        precio: 49.99,
        marca: "Fender",
        stock: 15,
        tipo: "Accesorio",
        categoriaProducto: "Accesorios",
        subcategoriaAccesorio: "Fundas & Estuches",
        imagenes: ["fender_gig_bag.jpg"],
        tipoAccesorio: "Fundas & Estuches",
        compatibilidad: "Guitarra Eléctrica",
        color: "Negro",
        material: "Nylon",
        especificacionesFunda: {
          tipo: "Blanda",
          interior: "Acolchado",
          bolsillos: 3,
          resistenteAgua: true
        }
      },
      {
        nombre: "Seymour Duncan JB Model",
        descripcion: "Pastilla humbucker de alta salida para posición de puente.",
        precio: 99.99,
        marca: "Otros",
        stock: 8,
        tipo: "Accesorio",
        categoriaProducto: "Accesorios",
        subcategoriaAccesorio: "Pastillas",
        imagenes: ["seymour_jb.jpg"],
        tipoAccesorio: "Pastillas",
        compatibilidad: "Guitarra Eléctrica",
        color: "Negro",
        material: "Alnico",
        especificacionesPastillas: {
          tipo: "Humbucker",
          posicion: "Puente",
          impedancia: "16.4k",
          salida: "Alta"
        }
      },
      {
        nombre: "Kit de Mantenimiento para Guitarra",
        descripcion: "Kit completo con productos de limpieza y herramientas.",
        precio: 29.99,
        marca: "Otros",
        stock: 20,
        tipo: "Accesorio",
        categoriaProducto: "Accesorios",
        subcategoriaAccesorio: "Herramientas & Limpiadores",
        imagenes: ["cleaning_kit.jpg"],
        tipoAccesorio: "Herramientas & Limpiadores",
        compatibilidad: "Universal",
        material: "Varios",
        especificacionesHerramientas: {
          tipoHerramienta: "Kit de limpieza",
          usos: ["Limpieza de cuerdas", "Pulido de diapasón", "Limpieza de cuerpo"]
        }
      }
    ];

    // Insert all products
    const allProducts = [...guitarrasElectricas, ...guitarrasAcusticas, ...amplificadores, ...accesorios];
    const inserted = await Producto.insertMany(allProducts);

    console.log(`¡Base de datos sembrada con éxito!`);
    console.log(`Insertadas ${guitarrasElectricas.length} guitarras eléctricas`);
    console.log(`Insertadas ${guitarrasAcusticas.length} guitarras acústicas`);
    console.log(`Insertados ${amplificadores.length} amplificadores y efectos`);
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