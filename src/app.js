const express = require('express');
const todosRouter = require('./modules/todos/todo.routes');
const errorHandler = require('./middleware/error-handler');

function createApp({ db, todos } = {}) {
  const app = express();
  app.locals.db = db;
  app.locals.todos = todos;
  app.use(express.json());
  app.use('/todos', todosRouter);
  app.get('/', (req, res) => {
    res.send('Todo backend server is running.');
  });
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
