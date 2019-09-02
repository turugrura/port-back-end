const mongoose = require('mongoose');

const mongoOption = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
}

// const dbPath = process.env.DATABASE_PRODUCTION || process.env.DATABASE_LOCAL;
let dbPath = (process.env.NODE_ENV === 'development') ? process.env.DATABASE_LOCAL : process.env.DATABASE_TEST;
if(process.env.NODE_ENV === 'production') {
    dbPath = process.env.DATABASE_PRODUCTION;
}

mongoose.connect(dbPath, mongoOption).then(() => {
    console.log(`connect MongoDB with mode ${process.env.NODE_ENV} successful!`);
});