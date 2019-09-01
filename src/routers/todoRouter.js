const express = require('express');
const router = express.Router({
    mergeParams: true
});

const { 
    createTodo, 
    updateTodo, 
    deleteTodo, 
    getTodo, 
    getTodos
} = require('../controllers/todoController');
const { protect } = require('../controllers/authController');

router.route('/')
    .get(getTodos)
    .post(protect, createTodo);

router.route('/:todoId')
    .get(getTodo)
    .patch(protect, updateTodo)
    .delete(protect, deleteTodo);

module.exports = router;