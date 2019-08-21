const Todo = require('../models/todo');

exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (error) {
        res.status(400).json({
            status: 'cannot get all todos',
            error: error.message
        })
    }
};

exports.getUser = async (req, res) => {
    try {
        const _id = req.params.id;
        const todo = await Todo.findOne({ _id });
        res.status(200).json(todo);
    } catch (error) {
        res.status(400).json({
            status: 'cannot get one todo',
            error: error.message
        })
    }
};

exports.createUser = async (req, res) => {
    try {
        const newTodo = await Todo.create(req.body);
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(400).json({
            status: 'cannot create todo',
            error: error.message
        })
    }
};