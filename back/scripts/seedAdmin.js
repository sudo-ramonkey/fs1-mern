require("dotenv").config();
const mongoose = require("mongoose");
const { User } = require("./src/models");
const bcrypt = require("bcrypt");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/fs1-mern";

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@elmundoguitarras.com" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const admin = new User({
      nombre: "Admin",
      apellido: "El Mundo Guitarras",
      email: "admin@elmundoguitarras.com",
      username: "admin",
      password: hashedPassword,
      role: "Admin",
      telefono: "+1234567890",
      direccion: {
        calle: "123 Admin St",
        ciudad: "Admin City",
        estado: "Admin State",
        codigoPostal: "12345",
        pais: "Admin Country"
      }
    });

    await admin.save();
    console.log("Admin user created successfully:");
    console.log(`Email: admin@elmundoguitarras.com`);
    console.log(`Password: admin123`);
    console.log(`Role: ${admin.role}`);

  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run if called directly
if (require.main === module) {
  seedAdmin();
}

module.exports = seedAdmin;
