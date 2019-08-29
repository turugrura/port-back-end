const getDataAllowedSave = (allowedField = [], body = {}) => {
    const returnObj = {};
    const saveField = Object.keys(body).filter( field => allowedField.includes(field));
    if(saveField.length === 0) {
        throw new Error('no data that allowed to save');
    };    

    saveField.forEach( key => {
        returnObj[key] = body[key]
    });

    return returnObj;
};

module.exports = {
    getDataAllowedSave
};