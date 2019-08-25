const Todo = require('../models/todo');

exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        
        res.status(200).json({
            status: 'success',
            count: todos.length,
            data: todos
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error.message
        });
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
        res.status(400).json({
            status: 'fail',
            error: error.message
        });
    }
};

exports.createTodo = async (req, res) => {
    try {
        const authorId = req.user._id;
        const { topic, content } = req.body;
        const todo = new Todo({
            authorId,
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
        res.status(400).json({
            status: 'fail',
            error: error.message
        });
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { topic, content } = req.body;

        const todo = await Todo.findByIdAndUpdate(id, {
            topic,
            content
        }, {
            runValidators: true,
            new: true
        });
        if(!todo) {
            throw new Error('This todo not found');
        };

        res.status(200).json({
            status: 'success',
            count: 1,
            data: todo
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error.message
        });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findByIdAndDelete({ _id: id });
        
        // if(todo.deletedCount == 0) {
        //     throw new Error('no todo was deleted');
        // };
        console.log(todo)
        res.status(200).json({
            status: 'success',
            count: todo.deleteCount,
            data: []
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error.message
        });
    }
};