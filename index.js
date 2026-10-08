const { port } = require('./src/config/env');
const { connectDatabase } = require('./src/database/connection');
const { initializeTodos } = require('./src/modules/todos/todo.repository');
const { createApp } = require('./src/app');

async function startServer() {
  let client;
  try {
    const connection = await connectDatabase();
    client = connection.client;
    const db = connection.db;
    const todos = await initializeTodos(db);
    console.log('연결 성공');
    const app = createApp({ db, todos });
    const server = app.listen(port, () => {
      console.log(`서버 실행: http://localhost:${port}`);
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
    console.error('서버 초기화 실패:', error.message);
    if (client) await client.close();
    process.exitCode = 1;
  }
}

if (require.main === module) startServer();
module.exports = { startServer };
