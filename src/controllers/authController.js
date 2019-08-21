const {promisify} = require('util');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
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
            length: 1,
            data: newUser
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) {
            throw new Error('username or password is invalid!');
        }
        const user = await User.findByCredentials(username, password);
        const token = await user.generateAuthToken();
        
        const userNoPass = user.toObject()
        delete userNoPass.tokens;
        
        res.status(200).json({
            status: 'success',
            length: 1,
            data: userNoPass,
            token
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: error.message
        })
    }
};

exports.protect = async (req, res, next) => {
    try {
        // check token valid
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        };

        if(!token) {
            throw new Error('You are not login');
        };

        // check user exist
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);
        if(!currentUser) {
            throw new Error('The user not exist');
        };

        // check password not change
        if(currentUser.changedPasswordAfter(decoded.iat)) {
            throw new Error('password has been changed');
        };

        res.user = currentUser;
        next();
    } catch (error) {
        res.status(401).json({
            status: 'fail',
            error: error.message
        });
    }    
};