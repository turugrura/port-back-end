const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const middleware = require('./middleware/mid');

const userRouter = require('./routes/userRouter');
const todoRouter = require('./routes/todoRouter');

const mongoOption = {
    useNewUrlParser: true,
    useCreateIndex: true
}
mongoose.connect('mongodb://localhost/myPort', mongoOption)
    .then(() => {
        console.log('connect DB successful!');
    });

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
app.use('/todos', todoRouter);

app.get('*', (req, res) => {
    res.status(404).json({
        error: 'page not found'
    })
});

module.exports = app;