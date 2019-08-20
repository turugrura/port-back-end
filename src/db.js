const mongoose = require('mongoose');

const mongoOption = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
}

const dbPath = process.env.DATABASE_PRODUCTION || process.env.DATABASE_LOCAL;

mongoose.connect(dbPath, mongoOption).then(() => {
    console.log('connect DB successful!');
});