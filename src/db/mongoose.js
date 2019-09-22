const mongoose = require('mongoose');

const mongoOption = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
}

// const dbPath = process.env.DATABASE_PRODUCTION || process.env.DATABASE_LOCAL;
let dbPath;
const nodeEnv = process.env.NODE_ENV;
if (nodeEnv === 'production') {
    dbPath = process.env.DATABASE_PRODUCTION;
} else if (nodeEnv === 'test') {
    dbPath = process.env.DATABASE_TEST;
} else {
    dbPath = process.env.DATABASE_LOCAL;
}

mongoose.connect(dbPath, mongoOption).then(() => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`connect MongoDB with mode ${process.env.NODE_ENV} successful!`);
    }
});