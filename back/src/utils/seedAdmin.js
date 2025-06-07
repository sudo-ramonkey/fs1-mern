require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('../models');
const { connectToDatabase, disconnectFromDatabase } = require('./database');

const createAdminUser = async () => {
  try {
    await connectToDatabase();
    console.log('Connected to database for admin seeding...');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'Admin' });

    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log(`Username: ${existingAdmin.username}`);
      console.log(`Email: ${existingAdmin.email}`);
      console.log('Skipping admin creation...');
      return;
    }

    // Create default admin user
    const adminData = {
      username: 'admin',
      email: 'admin@elmundodelasguitarras.com',
      password: 'Admin123!', // Change this in production
      firstName: 'System',
      lastName: 'Administrator',
      role: 'Admin',
      isActive: true,
      preferences: {
        newsletter: false,
        notifications: true
      }
    };

    const admin = new User(adminData);
    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('='.repeat(50));
    console.log('Admin Credentials:');
    console.log(`Username: ${admin.username}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: Admin123!`);
    console.log('='.repeat(50));
    console.log('⚠️  IMPORTANT: Change the default password after first login!');

  } catch (error) {
    console.error('Error creating admin user:', error.message);

    if (error.code === 11000) {
      console.error('Duplicate key error - user with this email/username already exists');
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      console.error('Validation errors:', errors);
    }

    process.exit(1);
  } finally {
    await disconnectFromDatabase();
  }
};

// Allow this script to be run directly or imported
if (require.main === module) {
  createAdminUser();
}

module.exports = createAdminUser;
