const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./src/app');

// connect DB
require('./src/db');

const PORT = process.env.PORT || 3000;

app.listen(PORT, (req, res) => {
    console.log(`Im on a port ${PORT}`)
});