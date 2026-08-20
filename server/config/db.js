const mongoose = require('mongoose');
const dns = require('dns');

// Ensure reliable DNS resolution for MongoDB Atlas SRV records on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore fallback if custom DNS set
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ykstore', {
      serverSelectionTimeoutMS: 8000
    });
    console.log(`[Database] ✅ MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed initial users & products if DB is empty
    try {
      const User = require('../models/User');
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[Database] Empty database detected. Running auto-seeder...');
        const seeder = require('../utils/seederRunner');
        await seeder();
      }
    } catch (seedErr) {
      console.log(`[Database Seeder Note] ${seedErr.message}`);
    }

  } catch (error) {
    console.error(`\n===========================================================`);
    console.error(`🔴 MONGODB CONNECTION FAILED!`);
    console.error(`Error details: ${error.message}`);
    console.error(`\n📌 REASON: MongoDB is not currently running on your PC.`);
    console.error(`📌 SOLUTION:`);
    console.error(`   1. Make sure MongoDB Community Server is installed & running.`);
    console.error(`   2. Open CMD as Admin and run: net start MongoDB`);
    console.error(`   3. OR update MONGO_URI in server/.env with your MongoDB Atlas URL.`);
    console.error(`===========================================================\n`);
  }
};

module.exports = connectDB;

