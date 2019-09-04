const handlerError = (res, statusCode, errorMsg = '') => {
    if (errorMsg.includes('Cast to ObjectId')) errorMsg = 'id incorrect';
    if (errorMsg.includes('jwt expired')) errorMsg = 'user expired, please login again';
// console.log(errorMsg)
    res.status(statusCode).json({
        status: 'fail',
        error: errorMsg
    });
};

const handlerSuccess = (res, statusCode, data, count = undefined) => {
    res.status(statusCode).json({
        status: 'success',
        count,
        data
    });  
};

module.exports = {
    handlerError,
    handlerSuccess
};