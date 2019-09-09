const AppError = require('../utils/appError');

const handlerDuplicateKey = err => {
    const errmsg = err.errmsg.split(' ');
    const field = errmsg[7].replace('_1', '');
    const value = errmsg[12];
    console.log(field, value)
    return AppError(`${value} already exists in ${field}.`, 400);
};

const handlerCastError = err => {
    const field = err.model.split(' ')[2];

    return AppError(`Id for ${field} is invalid.`, 400);
};

const handlerValidationError = err => {


    return AppError(``, 400);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        err,
        stack: err.stack,
        status: err.status,
        message: err.message
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        // Operataional, trusted error: send message to client
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        // unknow error occur
        res.status(500).json({
            status: 'error',
            message: 'Something wrong!!!'
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res);
    } else {
        let error = err;

        // if (error.code === 11000) error = handlerDuplicateKey(error);
        // if (error.name === 'CastError') error = handlerCastError(error);
        // if (error.name === 'ValidationError') error = handlerValidationError(error);

        sendErrorDev(error, res);
    };
};