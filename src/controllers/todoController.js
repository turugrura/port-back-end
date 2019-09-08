const Todo = require('../models/todoModel');
const User = require('../models/userModel');

const AppError = require('../utils/appError');
const { handlerSuccess } = require('./handlerResponse');
const { getDataAllowedSave } = require('../utils/manipulateReq');

exports.getTodo = async (req, res, next) => {
    try {
        const { userId, todoId } = req.params;

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
            
            if(todo.length === 0) {
                return next(new AppError('Todo not found.', 404));
            };
        };
        
        handlerSuccess(res, 200, todo);
    } catch (error) {
        next(new AppError(error.message, 400)); 
    }
};

exports.getTodos = async (req, res, next) => {
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
        next(new AppError(error.message, 400));
    }
};

exports.createTodo = async (req, res, next) => {
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
        next(new AppError(error.message, 400));
    }
};

exports.updateTodo = async (req, res, next) => {
    try {
        const { todoId } = req.params;
        const allowedField = ['topic','content','status'];
        const data = getDataAllowedSave(allowedField, req.body);
        
        const todo = await Todo.findById(todoId);
        if(todo.author.toString() != req.user._id) {
            return next(new AppError('No permission to update todo.', 401));
        };
        
        const updatedTodo = await Todo.findByIdAndUpdate(todoId, data, {
            runValidators: true,
            new: true
        });
        if(!updatedTodo) {
            return next(new AppError('Todo not found.', 404));
        };

        handlerSuccess(res, 200, updatedTodo);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

exports.deleteTodo = async (req, res, next) => {
    try {
        const { todoId } = req.params;

        const todoCheck = await Todo.findById(todoId);
        if(todoCheck.author.toString() != req.user._id) {
            return next(new AppError('No permission to delete todo.', 401));
        };

        const todo = await Todo.findByIdAndDelete(todoId);
        if(!todo) {
            return next(new AppError('Todo not found.', 404));
        };
        
        handlerSuccess(res, 200, []);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};