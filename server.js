const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('unhandledRejection', err => {
    console.log(err);
    console.log('unhandledRejection!!!');

    process.exit(1);
});

process.on('uncaughtException', err => {
    console.log(err);
    console.log('uncaughtException!!!');

    process.exit(1);
});

// connect DB
require('./src/db/mongoose');

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, (req, res) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`Im on a port ${PORT}`);
    }
});