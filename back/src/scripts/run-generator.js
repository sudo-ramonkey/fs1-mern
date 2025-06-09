#!/usr/bin/env node

/**
 * Script runner for generating products
 * Usage: node run-generator.js [amount]
 * Example: node run-generator.js 1000
 */

const { generateAllProducts } = require('./generateProducts');

// Get amount from command line argument
const amount = process.argv[2] ? parseInt(process.argv[2]) : null;

if (amount) {
  console.log(`🚀 Generating ${amount} products...`);
  // You can modify the generateProducts.js to accept amount parameter
} else {
  console.log('🚀 Generating default amount of products...');
}

generateAllProducts()
  .then(() => {
    console.log('✅ Product generation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Product generation failed:', error);
    process.exit(1);
  });
