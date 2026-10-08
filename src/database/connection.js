const { MongoClient } = require('mongodb');
const { mongoUri } = require('../config/env');

async function connectDatabase() {
  if (!mongoUri) throw new Error('MONGODB_URI를 .env 파일에 설정해주세요.');
  const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    const db = client.db();
    await db.command({ ping: 1 });
    return { client, db };
  } catch (error) {
    await client.close();
    throw error;
  }
}

module.exports = { connectDatabase };
