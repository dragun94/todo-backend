const { createTodoDocument } = require('./todo.model');
const { insertTodo } = require('./todo.repository');

async function createTodo(req, res) {
  let todo;
  try {
    todo = createTodoDocument(req.body?.title);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    const savedTodo = await insertTodo(req.app.locals.todos, todo);
    return res.status(201).json(savedTodo);
  } catch (error) {
    console.error('할 일 생성 실패:', error.name, error.code || '');
    return res.status(500).json({ error: '할 일을 저장하지 못했습니다.' });
  }
}

module.exports = { createTodo };
