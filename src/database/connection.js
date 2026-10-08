const { MongoClient } = require('mongodb');
const { mongoUri, localMongoUri } = require('../config/env');

async function connectDatabase() {
  const uris = mongoUri ? [mongoUri, localMongoUri] : [localMongoUri];
  for (const [index, uri] of [...new Set(uris)].entries()) {
    let client;
    try {
      client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
      await client.connect();
      const db = client.db();
      await db.command({ ping: 1 });
      console.log(uri === localMongoUri ? '로컬 MongoDB 연결 성공' : '설정된 MongoDB 연결 성공');
      return { client, db };
    } catch (error) {
      if (client) await client.close();
      if (index === 0 && uris.length > 1) {
        console.warn(`설정된 MongoDB 연결 실패: ${error.message}. 로컬 MongoDB로 재시도합니다.`);
        continue;
      }
      throw error;
    }
  }
}

module.exports = { connectDatabase };
