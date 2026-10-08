const { ObjectId } = require('mongodb');
const { createTodoDocument } = require('./todo.model');
const repository = require('./todo.repository');

function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function parseId(value) {
  if (!/^[0-9a-f]{24}$/i.test(value)) throw badRequest('올바른 할 일 ID를 입력해주세요.');
  return new ObjectId(value);
}

function validateTitle(title) {
  try { return createTodoDocument(title).title; }
  catch (error) { throw badRequest(error.message); }
}

function endpoint(action) {
  return async (req, res) => {
    try { await action(req, res); }
    catch (error) {
      if (error.status === 400) return res.status(400).json({ error: error.message });
      console.error('할 일 요청 실패:', error.name, error.code || '');
      return res.status(500).json({ error: '할 일 요청을 처리하지 못했습니다.' });
    }
  };
}

function notFound(res) {
  return res.status(404).json({ error: '할 일을 찾을 수 없습니다.' });
}

const listTodos = endpoint(async (req, res) => {
  res.json(await repository.listTodos(req.app.locals.todos));
});

const getTodo = endpoint(async (req, res) => {
  const todo = await repository.findTodo(req.app.locals.todos, parseId(req.params.id));
  if (!todo) return notFound(res);
  res.json(todo);
});

const createTodo = endpoint(async (req, res) => {
  const title = validateTitle(req.body?.title);
  const todo = await repository.insertTodo(req.app.locals.todos, createTodoDocument(title));
  res.status(201).json(todo);
});

const updateTodo = endpoint(async (req, res) => {
  const id = parseId(req.params.id);
  const body = req.body;
  if (!body || Array.isArray(body) || typeof body !== 'object' ||
      !Object.keys(body).length || Object.keys(body).some(key => !['title', 'completed'].includes(key))) {
    throw badRequest('title 또는 completed를 입력해주세요.');
  }
  const changes = {};
  if (Object.hasOwn(body, 'title')) changes.title = validateTitle(body.title);
  if (Object.hasOwn(body, 'completed')) {
    if (typeof body.completed !== 'boolean') throw badRequest('completed는 true 또는 false여야 합니다.');
    changes.completed = body.completed;
  }
  const todo = await repository.updateTodo(req.app.locals.todos, id, changes);
  if (!todo) return notFound(res);
  res.json(todo);
});

const deleteTodo = endpoint(async (req, res) => {
  const todo = await repository.deleteTodo(req.app.locals.todos, parseId(req.params.id));
  if (!todo) return notFound(res);
  res.status(204).end();
});

module.exports = { listTodos, getTodo, createTodo, updateTodo, deleteTodo };
