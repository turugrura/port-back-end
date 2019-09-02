const dotenv = require('dotenv');

dotenv.config({
    path: './config.env'
});

require('../src/db/mongoose')
    