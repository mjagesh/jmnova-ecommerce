const mongoose = require("mongoose");
const dns = require("dns");

const Product = require("../models/Product");
const products = require("../data/products");

require("dotenv").config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    // Remove existing products
    await Product.deleteMany({});

    console.log("Existing products deleted");

    // Add slug to every product
    const productsWithSlugs = products.map((product) => ({
      ...product,
      slug: createSlug(product.name),
    }));

    // Insert products
    await Product.insertMany(productsWithSlugs);

    console.log(`${productsWithSlugs.length} products inserted successfully`);

    await mongoose.connection.close();

    console.log("MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Product seeding failed:", error.message);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedProducts();
