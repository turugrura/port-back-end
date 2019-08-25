const express = require('express');
const router = express.Router();

const todoController = require('../controllers/todoController');
const authController = require('../controllers/authController');

router.route('/')
    .get(todoController.getTodos)
    .post(authController.protect, todoController.createTodo);

router.route('/:id')
    .get(todoController.getTodo)
    .patch(authController.protect, todoController.updateTodo)
    .delete(authController.protect, todoController.deleteTodo);

module.exports = router;