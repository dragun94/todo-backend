const { connectDatabase } = require('../src/database/connection');
const { initializeTodos } = require('../src/modules/todos/todo.repository');

async function initializeDatabase() {
  const { client, db } = await connectDatabase();
  try {
    await initializeTodos(db);
    console.log('todos 컬렉션 생성 및 검증 규칙 설정 완료');
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  initializeDatabase().catch((error) => {
    console.error('할 일 컬렉션 초기화 실패:', error.name, error.code || '');
    process.exitCode = 1;
  });
}

module.exports = { initializeDatabase };
