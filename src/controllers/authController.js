const {promisify} = require('util');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { handleError } = require('./handleError');

const sendToken = (res, user, status, token) => {
    const cookieOption = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 1000
        ),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOption);

    res.status(status).json({
        status: 'success',
        length: 1,
        data: user,
        token
    });
};

exports.signup = async (req, res) => {
    try {
        const { username, password, title } = req.body;
        const user = new User({
            username,
            password,
            title
        });

        const newUser = await user.save();
        const token = await user.generateAuthToken();
        
        sendToken(res, newUser, 201, token);
    } catch (error) {
        handleError(res, 400, error.message);
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
        
        sendToken(res, user, 200, token);
    } catch (error) {
        handleError(res, 400, error.message);
    }
};

exports.logout = async (req, res) => {
    try {
        const me = await User.findByIdAndUpdate(req.user._id, {
            token: ''
        });
        if(!me) {
            handleError(res, 401, 'Please login again');            
        };

        res.status(200).json({
            status: 'success',
            data: []
        });
    } catch (error) {
        handleError(res, 400, error.message);
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
        const currentUser = await User.findOne({
            _id: decoded.id,
            token
        });
        if(!currentUser) {
            throw new Error('Please login again');
        };

        // check password not change
        if(currentUser.changedPasswordAfter(decoded.iat)) {
            throw new Error('password has been changed');
        };

        req.token = token;
        req.user = currentUser;
        
        next();
    } catch (error) {
        handleError(res, 401, error.message);
    }    
};