const User = require('../models/userModel');

const AppError = require('../utils/appError');
const { handlerSuccess } = require('./handlerResponse');
const { getDataAllowedSave } = require('../utils/manipulateReq');

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        handlerSuccess(res, 200, users, users.length);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        let user = await User.find({ _id: userId });

        if (user.length === 0) {
            return next(new AppError('User not found.', 404));
        };

        if (req.token) {
            user = user[0].toJSON();
            user['token'] = req.token;
            user = [user]
        };

        handlerSuccess(res, 200, user);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const allowField = ['username', 'password', 'title', 'role', 'image'];
        const data = getDataAllowedSave(allowField, req.body);
        // const { username, password, title, role } = req.body;
        const user = new User(data);
        
        const newUser = await user.save();
        handlerSuccess(res, 201, newUser);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const allowedSave = ['title', 'role', 'images'];
        const data = getDataAllowedSave(allowedSave, req.body);
        
        const { userId } = req.params;
        const user = await User.findByIdAndUpdate(userId, data, {
            new: true,
            runValidators: true
        });
        if(!user) {
            return next(new AppError('User not found.', 404));
        };

        handlerSuccess(res, 200, user);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const delUser = await User.findByIdAndDelete(userId);
        if(!delUser) {
            return next(new AppError('User not found.', 404));
        };

        // TODO transaction
        handlerSuccess(res, 200, []);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

exports.getMe = async (req, res, next) => {
    try {
        req.params.userId = req.user._id;

        next();
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

exports.updateMe = async (req, res, next) => {
    try {
        const allowedSave = ['title', 'role', 'images'];
        const data = getDataAllowedSave(allowedSave, req.body);
        
        const me = await User.findByIdAndUpdate(req.user._id, data, {
            new: true,
            runValidators: true
        });

        if(!me) {
            return next(new AppError('Please login again.', 401));
        };

        handlerSuccess(res, 200, me);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

exports.deleteMe = async (req, res, next) => {
    try {
        const deletedMe = await User.findByIdAndUpdate(req.user._id, {
            active: false,
            token: ''
        }, {
            new: true
        });
        if(!deletedMe) {
            return next(new AppError('Please login again.', 401));
        };

        handlerSuccess(res, 200, deletedMe);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};