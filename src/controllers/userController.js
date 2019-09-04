const User = require('../models/user');

const { handlerError, handlerSuccess } = require('./handlerResponse');
const { getDataAllowedSave } = require('../utils/manipulateReq');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();

        handlerSuccess(res, 200, users, users.length);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

exports.getUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.find({ _id: userId });

        handlerSuccess(res, 200, user);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

exports.createUser = async (req, res) => {
    try {
        const allowField = ['username', 'password', 'title', 'role', 'image'];
        const data = getDataAllowedSave(allowField, req.body);
        // const { username, password, title, role } = req.body;
        const user = new User(data);
        
        const newUser = await user.save();
        handlerSuccess(res, 201, newUser);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const allowedSave = ['title', 'role', 'images'];
        const data = getDataAllowedSave(allowedSave, req.body);
        
        const { userId } = req.params;
        const user = await User.findByIdAndUpdate(userId, data, {
            new: true,
            runValidators: true
        });
        if(!user) {
            return handlerError(res, 400, 'user not found');
        };

        handlerSuccess(res, 200, user);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const delUser = await User.findByIdAndDelete(userId);
        if(!delUser) {
            return handlerError(res, 400, 'user not found');
        };

        // TODO transaction
        handlerSuccess(res, 200, []);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        req.params.id = req.user._id;

        next();
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

exports.updateMe = async (req, res) => {
    try {
        const allowedSave = ['title', 'role', 'images'];
        const data = getDataAllowedSave(allowedSave, req.body);
        
        const me = await User.findByIdAndUpdate(req.user._id, data, {
            new: true,
            runValidators: true
        });

        if(!me) {
            return handlerError(res, 401, 'Please login again');
        };

        handlerSuccess(res, 200, me);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

exports.deleteMe = async (req, res) => {
    try {
        const deletedMe = await User.findByIdAndUpdate(req.user._id, {
            active: false,
            token: ''
        }, {
            new: true
        });
        if(!deletedMe) {
            return handlerError(res, 401, 'Please login again');
        };

        handlerSuccess(res, 200, deletedMe);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};