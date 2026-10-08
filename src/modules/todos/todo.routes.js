const express = require('express');
const controller = require('./todo.controller');

const router = express.Router();
router.get('/', controller.listTodos);
router.get('/:id', controller.getTodo);
router.post('/', controller.createTodo);
router.patch('/:id', controller.updateTodo);
router.delete('/:id', controller.deleteTodo);

module.exports = router;
