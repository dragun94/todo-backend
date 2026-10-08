const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });

const app = express();
const PORT = 5000;
const mongoUri = process.env.MONGODB_URI;

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Todo backend server is running.');
});

async function startServer() {
  if (!mongoUri) {
    console.error('MONGODB_URI를 .env 파일에 설정해주세요.');
    process.exitCode = 1;
    return;
  }

  const client = new MongoClient(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await client.connect();
    await client.db().command({ ping: 1 });
    console.log('연결 성공');
    app.locals.db = client.db();

    const server = app.listen(PORT, () => {
      console.log(`서버 실행: http://localhost:${PORT}`);
    });

    server.on('error', async (error) => {
      console.error('서버 실행 실패:', error.message);
      await client.close();
      process.exitCode = 1;
    });

    const shutdown = () => {
      server.close(async () => {
        await client.close();
        process.exit(0);
      });
    };
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
  } catch (error) {
    console.error('MongoDB 연결 실패:', error.message);
    await client.close();
    process.exitCode = 1;
  }
}

startServer();
