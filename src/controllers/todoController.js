const Todo = require('../models/todo');
const User = require('../models/user');

const { handlerError, handlerSuccess } = require('./handlerResponse');
const { getDataAllowedSave } = require('../utils/manipulateReq');

exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
                
        handlerSuccess(res, 200, todos, todos.length);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

exports.getTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);
        
        handlerSuccess(res, 200, todo);
    } catch (error) {
        handlerError(res, 400, error.message);        
    }
};

exports.createTodo = async (req, res) => {
    try {
        const author = req.user._id;
        const allowedField = ['topic', 'content'];
        const data = getDataAllowedSave(allowedField, req.body);

        const todo = await new Todo({
            author,
            ...data
        }).save();

        handlerSuccess(res, 201, todo);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const allowedField = ['topic','content','status'];
        const data = getDataAllowedSave(allowedField, req.body);
        console.log(data)
        const todo = await Todo.findByIdAndUpdate(id, data, {
            runValidators: true,
            new: true
        });
        if(!todo) {
            throw new Error('todo not found');
        };

        handlerSuccess(res, 200, todo);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findByIdAndDelete(id);
        if(!todo) {
            throw new Error('todo not found');
        };
        
        handlerSuccess(res, 200, []);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};