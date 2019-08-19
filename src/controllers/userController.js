const mongoose = require('mongoose');
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
        res.status(400).json({
            error
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const _id = req.params.id;
        const user = await User.findOne({ _id });
        res.status(200).json({
            status: 'success',
            count: 1,
            data: user
        });
    } catch (error) {
        res.status(400).json({
            error
        });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { username, password, title } = req.body;
        const user = new User({
            username,
            password,
            title
        });

        const newUser = await user.save();
        res.status(201).json({
            status: 'success',
            count: 1,
            data: newUser
        });
    } catch (error) {
        res.status(400).json({
            error
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const allowUpdates = ['password', 'title'];
        const updateField = Object.keys(req.body).filter( key => allowUpdates.includes(key));
        if(updateField.length === 0) {
            throw new Error('no data that allowed to update');
        };
        
        const _id = mongoose.Types.ObjectId(req.params.id);
        const user = await User.findOne({ _id });
        if(!user) {
            throw new Error('user not found');
        };

        updateField.forEach( key => {
            user[key] = req.body[key]
        });
        const updateUser = await user.save();
        
        res.status(200).json({
            status: 'success',
            count: 1,
            data: updateUser
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            error
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const _id = mongoose.Types.ObjectId(req.params.id);
        const delUser = await User.deleteOne({ _id });
        if(!delUser || delUser.deletedCount === 0) {
            throw new Error().message = 'No user delete'
        }
        res.status(200).json({
            status: 'success',
            count: delUser.ok,
            data: []
        });
    } catch (error) {
        res.status(400).json({
            error,
            status: 'cannot delete user'
        });
    }
};