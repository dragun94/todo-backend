const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

module.exports = {
  port: 5000,
  mongoUri: process.env.MONGODB_URI,
};
