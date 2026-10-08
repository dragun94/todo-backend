const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

module.exports = {
  port: process.env.port || 5000,
  mongoUri: process.env.MONGO_URL || process.env.MONGO_URI || process.env.MONGODB_URI,
  localMongoUri: 'mongodb://127.0.0.1:27017/todo-backend',
};
