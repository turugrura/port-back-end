const express = require('express');
const router = express.Router();

const todoController = require('../controllers/todoController');
const authController = require('../controllers/authController');

router.route('/:authorId/todos')
    .get(todoController.getTodos)
    .post(authController.protect, todoController.createTodo);

router.route('/:authorId/todos/:id')
    .patch(authController.protect, todoController.updateTodo)
    .delete(authController.protect, todoController.deleteTodo);

module.exports = router;