require('dotenv').config();
const mongoose = require('mongoose');
const { Producto, User } = require('../models');
const {
  connectToDatabase,
  disconnectFromDatabase,
  clearCollection,
  dropCollection,
  getDatabaseStats,
  listCollections,
  countDocuments
} = require('./database');

/**
 * Database Management Utility
 * Provides various database operations for maintenance and testing
 */
class DatabaseManager {
  constructor() {
    this.isConnected = false;
  }

  /**
   * Connect to database if not already connected
   */
  async connect() {
    if (!this.isConnected) {
      await connectToDatabase();
      this.isConnected = true;
      console.log('✅ Database connected successfully');
    }
  }

  /**
   * Disconnect from database
   */
  async disconnect() {
    if (this.isConnected) {
      await disconnectFromDatabase();
      this.isConnected = false;
      console.log('✅ Database disconnected successfully');
    }
  }

  /**
   * Clear all products from database
   */
  async clearProducts() {
    try {
      await this.connect();
      const result = await Producto.deleteMany({});
      console.log(`✅ Cleared ${result.deletedCount} products from database`);
      return result;
    } catch (error) {
      console.error('❌ Error clearing products:', error.message);
      throw error;
    }
  }

  /**
   * Clear all users from database
   */
  async clearUsers() {
    try {
      await this.connect();
      const result = await User.deleteMany({});
      console.log(`✅ Cleared ${result.deletedCount} users from database`);
      return result;
    } catch (error) {
      console.error('❌ Error clearing users:', error.message);
      throw error;
    }
  }

  /**
   * Clear all data from database
   */
  async clearAll() {
    try {
      await this.connect();
      console.log('🧹 Clearing all data from database...');

      const productResult = await this.clearProducts();
      const userResult = await this.clearUsers();

      console.log(`✅ Total cleared: ${productResult.deletedCount + userResult.deletedCount} documents`);
      return {
        products: productResult.deletedCount,
        users: userResult.deletedCount,
        total: productResult.deletedCount + userResult.deletedCount
      };
    } catch (error) {
      console.error('❌ Error clearing all data:', error.message);
      throw error;
    }
  }

  /**
   * Reset database - clear all data and optionally reseed
   */
  async resetDatabase(options = {}) {
    try {
      const { seedProducts = false, createAdmin = false } = options;

      console.log('🔄 Resetting database...');

      // Clear all data
      await this.clearAll();

      // Optionally seed products
      if (seedProducts) {
        console.log('🌱 Seeding products...');
        const seedScript = require('../../scripts/newSeedDatabase');
        // Note: We need to modify the seed script to work with this utility
      }

      // Optionally create admin user
      if (createAdmin) {
        console.log('👤 Creating admin user...');
        const createAdminUser = require('./seedAdmin');
        await createAdminUser();
      }

      console.log('✅ Database reset completed successfully');
    } catch (error) {
      console.error('❌ Error resetting database:', error.message);
      throw error;
    }
  }

  /**
   * Get database statistics
   */
  async getStats() {
    try {
      await this.connect();

      // Get MongoDB stats
      const dbStats = await getDatabaseStats();

      // Get collection counts
      const productCount = await Producto.countDocuments();
      const userCount = await User.countDocuments();
      const adminCount = await User.countDocuments({ role: 'Admin' });
      const activeUserCount = await User.countDocuments({ isActive: true });

      // Get product type breakdown
      const instrumentCount = await Producto.countDocuments({ tipo: 'Instrumento' });
      const equipoCount = await Producto.countDocuments({ tipo: 'Equipo' });
      const accesorioCount = await Producto.countDocuments({ tipo: 'Accesorio' });

      const stats = {
        database: {
          name: dbStats.database,
          collections: dbStats.collections,
          dataSize: `${(dbStats.dataSize / 1024 / 1024).toFixed(2)} MB`,
          storageSize: `${(dbStats.storageSize / 1024 / 1024).toFixed(2)} MB`,
          indexes: dbStats.indexes,
          objects: dbStats.objects
        },
        collections: {
          products: {
            total: productCount,
            instrumentos: instrumentCount,
            equipos: equipoCount,
            accesorios: accesorioCount
          },
          users: {
            total: userCount,
            admins: adminCount,
            active: activeUserCount,
            inactive: userCount - activeUserCount
          }
        }
      };

      console.log('📊 Database Statistics:');
      console.log(JSON.stringify(stats, null, 2));

      return stats;
    } catch (error) {
      console.error('❌ Error getting database stats:', error.message);
      throw error;
    }
  }

  /**
   * List all collections in database
   */
  async listCollections() {
    try {
      await this.connect();
      const collections = await listCollections();
      console.log('📋 Collections in database:', collections);
      return collections;
    } catch (error) {
      console.error('❌ Error listing collections:', error.message);
      throw error;
    }
  }

  /**
   * Backup products to JSON file
   */
  async backupProducts(filepath = 'backup_products.json') {
    try {
      await this.connect();
      const products = await Producto.find({});
      const fs = require('fs').promises;

      await fs.writeFile(filepath, JSON.stringify(products, null, 2));
      console.log(`✅ Backed up ${products.length} products to ${filepath}`);
      return products.length;
    } catch (error) {
      console.error('❌ Error backing up products:', error.message);
      throw error;
    }
  }

  /**
   * Backup users to JSON file (without passwords)
   */
  async backupUsers(filepath = 'backup_users.json') {
    try {
      await this.connect();
      const users = await User.find({}).select('-password');
      const fs = require('fs').promises;

      await fs.writeFile(filepath, JSON.stringify(users, null, 2));
      console.log(`✅ Backed up ${users.length} users to ${filepath}`);
      return users.length;
    } catch (error) {
      console.error('❌ Error backing up users:', error.message);
      throw error;
    }
  }

  /**
   * Restore products from JSON file
   */
  async restoreProducts(filepath = 'backup_products.json') {
    try {
      await this.connect();
      const fs = require('fs').promises;

      const data = await fs.readFile(filepath, 'utf8');
      const products = JSON.parse(data);

      // Clear existing products
      await this.clearProducts();

      // Insert products
      const result = await Producto.insertMany(products);
      console.log(`✅ Restored ${result.length} products from ${filepath}`);
      return result.length;
    } catch (error) {
      console.error('❌ Error restoring products:', error.message);
      throw error;
    }
  }

  /**
   * Find and fix data inconsistencies
   */
  async validateData() {
    try {
      await this.connect();
      console.log('🔍 Validating data integrity...');

      const issues = [];

      // Check for products without required fields
      const productsWithoutNombre = await Producto.countDocuments({
        $or: [{ nombre: null }, { nombre: "" }, { nombre: { $exists: false } }]
      });
      if (productsWithoutNombre > 0) {
        issues.push(`${productsWithoutNombre} products without nombre`);
      }

      const productsWithoutPrecio = await Producto.countDocuments({
        $or: [{ precio: null }, { precio: { $lte: 0 } }, { precio: { $exists: false } }]
      });
      if (productsWithoutPrecio > 0) {
        issues.push(`${productsWithoutPrecio} products with invalid precio`);
      }

      // Check for users without required fields
      const usersWithoutEmail = await User.countDocuments({
        $or: [{ email: null }, { email: "" }, { email: { $exists: false } }]
      });
      if (usersWithoutEmail > 0) {
        issues.push(`${usersWithoutEmail} users without email`);
      }

      // Check for duplicate emails
      const duplicateEmails = await User.aggregate([
        { $group: { _id: "$email", count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } }
      ]);
      if (duplicateEmails.length > 0) {
        issues.push(`${duplicateEmails.length} duplicate email addresses`);
      }

      if (issues.length === 0) {
        console.log('✅ No data integrity issues found');
      } else {
        console.log('⚠️  Data integrity issues found:');
        issues.forEach(issue => console.log(`  - ${issue}`));
      }

      return issues;
    } catch (error) {
      console.error('❌ Error validating data:', error.message);
      throw error;
    }
  }

  /**
   * Create indexes for better performance
   */
  async createIndexes() {
    try {
      await this.connect();
      console.log('📈 Creating database indexes...');

      // Product indexes
      await Producto.createIndexes();

      // User indexes
      await User.createIndexes();

      // Additional custom indexes
      await Producto.collection.createIndex({ nombre: 'text', descripcion: 'text' });
      await Producto.collection.createIndex({ precio: 1 });
      await Producto.collection.createIndex({ marca: 1 });
      await Producto.collection.createIndex({ categoriaProducto: 1 });

      console.log('✅ Database indexes created successfully');
    } catch (error) {
      console.error('❌ Error creating indexes:', error.message);
      throw error;
    }
  }
}

// CLI functionality
if (require.main === module) {
  const dbManager = new DatabaseManager();
  const command = process.argv[2];

  const runCommand = async () => {
    try {
      switch (command) {
        case 'stats':
          await dbManager.getStats();
          break;
        case 'clear-products':
          await dbManager.clearProducts();
          break;
        case 'clear-users':
          await dbManager.clearUsers();
          break;
        case 'clear-all':
          await dbManager.clearAll();
          break;
        case 'reset':
          const seedProducts = process.argv.includes('--seed-products');
          const createAdmin = process.argv.includes('--create-admin');
          await dbManager.resetDatabase({ seedProducts, createAdmin });
          break;
        case 'validate':
          await dbManager.validateData();
          break;
        case 'backup-products':
          const productFile = process.argv[3] || 'backup_products.json';
          await dbManager.backupProducts(productFile);
          break;
        case 'backup-users':
          const userFile = process.argv[3] || 'backup_users.json';
          await dbManager.backupUsers(userFile);
          break;
        case 'restore-products':
          const restoreProductFile = process.argv[3] || 'backup_products.json';
          await dbManager.restoreProducts(restoreProductFile);
          break;
        case 'create-indexes':
          await dbManager.createIndexes();
          break;
        case 'list-collections':
          await dbManager.listCollections();
          break;
        default:
          console.log('📖 Available commands:');
          console.log('  stats                    - Show database statistics');
          console.log('  clear-products          - Clear all products');
          console.log('  clear-users             - Clear all users');
          console.log('  clear-all               - Clear all data');
          console.log('  reset [--seed-products] [--create-admin] - Reset database');
          console.log('  validate                - Validate data integrity');
          console.log('  backup-products [file]  - Backup products to JSON');
          console.log('  backup-users [file]     - Backup users to JSON');
          console.log('  restore-products [file] - Restore products from JSON');
          console.log('  create-indexes          - Create database indexes');
          console.log('  list-collections        - List all collections');
          break;
      }
    } catch (error) {
      console.error('❌ Command failed:', error.message);
      process.exit(1);
    } finally {
      await dbManager.disconnect();
    }
  };

  runCommand();
}

module.exports = DatabaseManager;
