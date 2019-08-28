const express = require('express');
const router = express.Router();

const { createTodo, updateTodo, deleteTodo , getTodo, getTodos} = require('../controllers/todoController');
const { protect } = require('../controllers/authController');

router.route('/')
    .get(getTodos)
    .post(protect, createTodo);

router.route('/:id')
    .get(getTodo)
    .patch(protect, updateTodo)
    .delete(protect, deleteTodo);

module.exports = router;