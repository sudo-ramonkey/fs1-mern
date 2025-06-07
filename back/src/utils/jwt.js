const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
const TESTING_MODE = process.env.TESTING_MODE === "true";
const TESTING_ADMIN_TOKEN = process.env.TESTING_ADMIN_TOKEN;
const TESTING_USER_ID = process.env.TESTING_USER_ID;

/**
 * Generate a JWT token for a user
 * @param {Object} payload - User data to include in token
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify a JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    // Check if this is the testing token
    if (TESTING_MODE && token === TESTING_ADMIN_TOKEN) {
      return {
        userId: TESTING_USER_ID,
        username: "testing-admin",
        email: "testing@elmundodelasguitarras.com",
        role: "Admin",
        testing: true,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // 1 year from now
      };
    }

    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

/**
 * Extract token from Authorization header
 * @param {String} authHeader - Authorization header value
 * @returns {String|null} Token or null if not found
 */
const extractTokenFromHeader = (authHeader) => {
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }
  return null;
};

/**
 * Generate a testing token (for development only)
 * @returns {String} Testing token
 */
const generateTestingToken = () => {
  if (!TESTING_MODE) {
    throw new Error("Testing tokens can only be generated in testing mode");
  }
  return TESTING_ADMIN_TOKEN;
};

/**
 * Check if a token is a testing token
 * @param {String} token - Token to check
 * @returns {Boolean} True if testing token
 */
const isTestingToken = (token) => {
  return TESTING_MODE && token === TESTING_ADMIN_TOKEN;
};

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  generateTestingToken,
  isTestingToken,
  TESTING_MODE,
  TESTING_ADMIN_TOKEN,
};
