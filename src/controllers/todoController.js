const Todo = require('../models/todo');
const { handleError } = require('./handleError');

exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        
        res.status(200).json({
            status: 'success',
            count: todos.length,
            data: todos
        });
    } catch (error) {
        handleError(res, 400, error.message);
    }
};

exports.getTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todos = await Todo.findById(id);
        
        res.status(200).json({
            status: 'success',
            count: 1,
            data: todos
        });
    } catch (error) {
        handleError(res, 400, error.message);        
    }
};

exports.createTodo = async (req, res) => {
    try {
        const author = req.user._id;
        const { topic, content } = req.body;
        const todo = new Todo({
            author,
            topic,
            content
        });

        const newTodo = await todo.save();

        res.status(201).json({
            status: 'success',
            count: 1,
            data: newTodo
        });
    } catch (error) {
        handleError(res, 400, error.message);
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { topic, content, status } = req.body;

        const todo = await Todo.findByIdAndUpdate(id, {
            topic,
            content,
            status
        }, {
            runValidators: true,
            new: true
        });
        if(!todo) {
            throw new Error('todo not found');
        };

        res.status(200).json({
            status: 'success',
            count: 1,
            data: todo
        });
    } catch (error) {
        handleError(res, 400, error.message);
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findByIdAndDelete(id);
        if(!todo) {
            throw new Error('todo not found');
        };
        
        res.status(200).json({
            status: 'success',
            count: todo.deleteCount,
            data: []
        });
    } catch (error) {
        handleError(res, 400, error.message);
    }
};