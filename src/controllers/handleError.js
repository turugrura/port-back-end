exports.handleError = (res, statusCode, errorMsg) => {
    res.status(statusCode).json({
        status: 'fail',
        error: errorMsg
    });
};