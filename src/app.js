const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const bodyParser = require('body-parser');

const middleware = require('./middleware/mid');

const userRouter = require('./routes/userRouter');
const todoRouter = require('./routes/todoRouter');
const postRouter = require('./routes/postRouter');

// Set security HTTP headers
app.use(helmet());

// limit request from same IP
const limiter = rateLimit({
    max: 100,
    windowMs: 60*60*1000,
    message: 'Too many request from this IP, please try again next hour'
});
app.use(limiter)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json({
    limit: '10kb'
}));

// against NoSQL query injection (filter $ . out of params.body)
app.use(mongoSanitize());

// againt cross site script
app.use(xss());

// Prevent paramiter pollution (sortBy='name'&sortBy='username' => sortBy='username')
app.use(hpp({
    whitelist: ['name']
}));

/**
 * - Custom Middleware
 */
app.use(middleware.printMessage1);

// Router
app.use('/users', userRouter);
app.use('/todos', todoRouter);
app.use('/posts', postRouter)

app.get('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        error: 'page not found'
    })
});

module.exports = app;