const dotenv = require('dotenv');
const mongoose = require('mongoose');
const dns = require('dns');
const seedDataRunner = require('./seederRunner');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

dotenv.config();

const connectDBAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ykstore');
    console.log('[Seeder] Connected to MongoDB');
    await seedDataRunner();
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

connectDBAndSeed();
