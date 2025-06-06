require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const productosRoutes = require("./routes/productos");

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/fs1-mern";
console.log("Using MongoDB:", MONGO_URI);

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/productos", productosRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("API is running");
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
