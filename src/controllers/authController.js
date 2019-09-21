const {promisify} = require('util');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const sendToken = (res, user, status, token) => {
    const cookieOption = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 1000
        ),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOption.secure = true;

    res.cookie('jwt', token, cookieOption);

    res.status(status).json({
        status: 'success',
        length: 1,
        data: user,
        token
    });
};

const signup = async (req, res, next) => {
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
        next(new AppError(error.message, 400));
    }
};

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) {
            return next(new AppError('username or password is invalid.', 400));
        }
        const user = await User.findByCredentials(username, password);
        if (!user) {
            return next(new AppError('username or password is invalid', 400));
        };

        const token = await user.generateAuthToken();        
        
        sendToken(res, user, 200, token);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

const logout = async (req, res, next) => {
    try {
        const me = await User.findByIdAndUpdate(req.user._id, {
            token: ''
        });
        if(!me) {
            return next(new AppError('Please login again', 401));
        };

        res.status(200).json({
            status: 'success',
            data: []
        });
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

const protect = async (req, res, next) => {
    try {
        // check token valid
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        };

        if(!token) {
            return next(new AppError('Token is invalid, please login again.', 401));
        };

        // check user exist
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const currentUser = await User.findOne({
            _id: decoded.id,
            token
        });
        if(!currentUser) {
            return next(new AppError('Current user not existed or token is invalid, please login again.', 401));
        };

        // check password not change
        if(currentUser.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('Password has been changed, please login again', 401));
        };

        req.token = token;
        req.user = currentUser;
        
        next();
    } catch (error) {
        next(new AppError(error.message, 401));
    }    
};

module.exports = {
    sendToken,
    signup,
    login,
    login,
    logout,
    protect
}