const { todoValidator } = require('./todo.model');

async function initializeTodos(db) {
  const options = {
    validator: todoValidator,
    validationLevel: 'strict',
    validationAction: 'error',
  };

  try {
    await db.createCollection('todos', options);
  } catch (error) {
    if (error.code !== 48) throw error;
    await db.command({ collMod: 'todos', ...options });
  }

  const todos = db.collection('todos');
  await todos.createIndex({ createdAt: -1 }, { name: 'todos_createdAt_desc' });
  return todos;
}

async function insertTodo(collection, todo) {
  const result = await collection.insertOne(todo);
  return { ...todo, _id: result.insertedId };
}

module.exports = { initializeTodos, insertTodo };
