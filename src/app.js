const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const middleware = require('./middleware/mid');

const userRouter = require('./routes/userRouter');
const todoRouter = require('./routes/todoRouter');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

/**
 * - Middleware
 * - only test
 */
app.use(middleware.printMessage1);
app.use(middleware.printMessage2);

app.use('/users', userRouter);
app.use('/users', todoRouter);

app.get('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        error: 'page not found'
    })
});

module.exports = app;