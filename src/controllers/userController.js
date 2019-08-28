const mongoose = require('mongoose');
const { handleError } = require('./handleError');
const User = require('../models/user');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            status: 'success',
            count: users.length,
            data: users
        });
    } catch (error) {
        handleError(res, 400, error.message);
    }
};

exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
            .populate({
                path: 'todos',
                select: 'topic content status'
            })
            .populate({
                path: 'posts',
                select: 'content like'
            });

        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        handleError(res, 400, error.message);
    }
};

exports.createUser = async (req, res) => {
    try {
        const { username, password, title, role } = req.body;
        const user = new User({
            username,
            password,
            title,
            role
        });

        const newUser = await user.save();
        res.status(201).json({
            status: 'success',
            data: newUser
        });
    } catch (error) {
        handleError(res, 400, error.message);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const allowUpdates = ['password', 'title', 'role'];
        const updateField = Object.keys(req.body).filter( key => allowUpdates.includes(key));
        if(updateField.length === 0) {
            throw new Error('no data that allowed to update');
        };
        
        const { id } = req.params;
        const user = await User.findById(id);
        if(!user) {
            throw new Error('user not found');
        };

        updateField.forEach( key => {
            user[key] = req.body[key]
        });
        const updateUser = await user.save();
        
        res.status(200).json({
            status: 'success',
            data: updateUser
        });
    } catch (error) {
        handleError(res, 400, error.message);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const delUser = await User.findByIdAndDelete(id);
        if(!delUser) {
            throw new Error('user not found')
        };
        // TODO transaction
        res.status(200).json({
            status: 'success',
            data: []
        });
    } catch (error) {
        handleError(res, 400, error.message);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        // const user = await req.user;
        req.params.id = req.user._id;

        next();
        // res.status(200).json({
        //     status: 'success',
        //     data: user
        // });
    } catch (error) {
        handleError(res, 400, error.message);
    }
};

exports.updateMe = async (req, res) => {
    try {
        const { title } = req.body;
        const me = await User.findByIdAndUpdate(req.user._id, {
            title
        }, {
            new: true,
            runValidators: true
        });

        if(!me) {
            handleError(res, 401, 'Please login again');
        };

        res.status(200).json({
            status: 'success',
            data: me
        });
    } catch (error) {
        handleError(res, 400, error.message);
    }
};

exports.deleteMe = async (req, res) => {
    try {
        const deletedMe = await User.findByIdAndUpdate(req.user._id, {
            active: false,
            token: ''
        });
        if(!deletedMe) {
            handleError(res, 401, 'Please login again');
        };

        res.status(200).json({
            status: 'success',
            data: deletedMe
        });
    } catch (error) {
        handleError(res, 400, error.message);
    }
};

exports.getUserTodos = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).populate({
            path: 'todos'
        });
        if(!user) {
            throw new Error('user not found');
        };

        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        handleError(res, 400, error.message);
    }
};

exports.getUsersTodos = async (req, res) => {
    try {
        const users = await User.find().populate('todos');

        res.status(200).json({
            status: 'success',
            count: users.length,
            data: users
        });
    } catch (error) {
        handleError(res, 400, error.message);
    }
};