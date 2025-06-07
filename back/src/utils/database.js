require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/elmundodelasguitarras';

/**
 * Connect to MongoDB database
 * @returns {Promise} MongoDB connection
 */
const connectToDatabase = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};

/**
 * Disconnect from MongoDB database
 * @returns {Promise}
 */
const disconnectFromDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error(`Error disconnecting from MongoDB: ${error.message}`);
    throw error;
  }
};

/**
 * Clear all documents from a collection
 * @param {String} collectionName - Name of the collection to clear
 * @returns {Promise}
 */
const clearCollection = async (collectionName) => {
  try {
    const result = await mongoose.connection.db.collection(collectionName).deleteMany({});
    console.log(`Cleared ${result.deletedCount} documents from ${collectionName} collection`);
    return result;
  } catch (error) {
    console.error(`Error clearing collection ${collectionName}:`, error.message);
    throw error;
  }
};

/**
 * Drop a collection entirely
 * @param {String} collectionName - Name of the collection to drop
 * @returns {Promise}
 */
const dropCollection = async (collectionName) => {
  try {
    await mongoose.connection.db.collection(collectionName).drop();
    console.log(`Dropped collection: ${collectionName}`);
  } catch (error) {
    if (error.code === 26) {
      console.log(`Collection ${collectionName} does not exist`);
    } else {
      console.error(`Error dropping collection ${collectionName}:`, error.message);
      throw error;
    }
  }
};

/**
 * Get database statistics
 * @returns {Promise<Object>} Database stats
 */
const getDatabaseStats = async () => {
  try {
    const stats = await mongoose.connection.db.stats();
    return {
      database: stats.db,
      collections: stats.collections,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      objects: stats.objects
    };
  } catch (error) {
    console.error('Error getting database stats:', error.message);
    throw error;
  }
};

/**
 * List all collections in the database
 * @returns {Promise<Array>} Array of collection names
 */
const listCollections = async () => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    return collections.map(col => col.name);
  } catch (error) {
    console.error('Error listing collections:', error.message);
    throw error;
  }
};

/**
 * Count documents in a collection
 * @param {String} collectionName - Name of the collection
 * @param {Object} filter - Optional filter for counting
 * @returns {Promise<Number>} Document count
 */
const countDocuments = async (collectionName, filter = {}) => {
  try {
    const count = await mongoose.connection.db.collection(collectionName).countDocuments(filter);
    return count;
  } catch (error) {
    console.error(`Error counting documents in ${collectionName}:`, error.message);
    throw error;
  }
};

/**
 * Check if database connection is ready
 * @returns {Boolean} Connection status
 */
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Wait for database connection to be ready
 * @param {Number} timeout - Timeout in milliseconds (default: 10000)
 * @returns {Promise}
 */
const waitForConnection = (timeout = 10000) => {
  return new Promise((resolve, reject) => {
    if (isConnected()) {
      resolve();
      return;
    }

    const timer = setTimeout(() => {
      reject(new Error('Database connection timeout'));
    }, timeout);

    mongoose.connection.once('connected', () => {
      clearTimeout(timer);
      resolve();
    });

    mongoose.connection.once('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
};

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
  clearCollection,
  dropCollection,
  getDatabaseStats,
  listCollections,
  countDocuments,
  isConnected,
  waitForConnection,
  MONGO_URI
};
