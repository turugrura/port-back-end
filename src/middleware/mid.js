const jwt = require('jsonwebtoken');

const printMessage1 = (req, res, next) => {
    console.log('Im from middle wares1')
    next();
};

const printMessage2 = (req, res, next) => {
    console.log('Im from middle wares2')
    // const j = jwt.sign('tonggggg','secreateKey');
    // console.log(j)
    next();
};

module.exports = {
    printMessage1,
    printMessage2
}