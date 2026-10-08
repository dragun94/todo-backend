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

async function listTodos(collection) {
  return collection.find({}).sort({ createdAt: -1, _id: -1 }).toArray();
}

async function findTodo(collection, id) {
  return collection.findOne({ _id: id });
}

async function updateTodo(collection, id, changes) {
  return collection.findOneAndUpdate(
    { _id: id },
    { $set: { ...changes, updatedAt: new Date() } },
    { returnDocument: 'after', includeResultMetadata: false }
  );
}

async function deleteTodo(collection, id) {
  return collection.findOneAndDelete({ _id: id }, { includeResultMetadata: false });
}

module.exports = { initializeTodos, insertTodo, listTodos, findTodo, updateTodo, deleteTodo };

