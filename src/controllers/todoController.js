const Todo = require('../models/todoModel');
const User = require('../models/userModel');

const { handlerError, handlerSuccess } = require('./handlerResponse');
const { getDataAllowedSave } = require('../utils/manipulateReq');

exports.getTodo = async (req, res) => {
    try {
        const { userId, todoId } = req.params;
        // const todo = await Todo.findById(todoId);

        let todo;
        let filter = {};
        if(userId) filter._id = userId;

        if(req.baseUrl.includes('users')) {
            todo = await User.find(filter).populate({
                path: 'todos',
                match: { _id: todoId }
            });
        } else {
            todo = await Todo.find({ _id: todoId });
        }
        
        handlerSuccess(res, 200, todo);
    } catch (error) {
        handlerError(res, 400, error.message);        
    }
};

exports.getTodos = async (req, res) => {
    try {        
        // const todos = await Todo.find(filter);
        const { userId } = req.params;
        
        let todos;
        let count = 0;
        let filter = {};
        if(userId) filter._id = userId;

        if(req.baseUrl.includes('users')) {
            todos = await User.find(filter).populate('todos');
            
            todos.forEach( user => {
                count += user.todos.length;
            });
        } else {
            todos = await Todo.find();
            count = todos.length;
        }
                
        handlerSuccess(res, 200, todos, count);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

exports.createTodo = async (req, res) => {
    try {
        const author = req.user._id;
        const allowedField = ['topic', 'content'];
        const data = getDataAllowedSave(allowedField, req.body);

        const newTodo = await new Todo({
            author,
            ...data
        }).save();

        handlerSuccess(res, 201, newTodo);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const { todoId } = req.params;
        const allowedField = ['topic','content','status'];
        const data = getDataAllowedSave(allowedField, req.body);
        
        const todo = await Todo.findById(todoId);
        if(todo.author.toString() != req.user._id) {
            return handlerError(res, 401, 'todo is not your');
        };
        
        const updatedTodo = await Todo.findByIdAndUpdate(todoId, data, {
            runValidators: true,
            new: true
        });
        if(!updatedTodo) {
            return handlerError(res, 400, 'todo not found');
        };

        handlerSuccess(res, 200, updatedTodo);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const { todoId } = req.params;

        const todoCheck = await Todo.findById(todoId);
        if(todoCheck.author.toString() != req.user._id) {
            return handlerError(res, 401, 'todo is not your');
        };

        const todo = await Todo.findByIdAndDelete(todoId);
        if(!todo) {
            return handlerError(res, 400, 'todo not found');
        };
        
        handlerSuccess(res, 200, []);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};