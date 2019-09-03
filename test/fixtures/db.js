const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');

// for test default value
// const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    username: 'tong11111',
    password: 'password'
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    username: 'tong2222',
    password: 'password',
    title: 'I am user 2',
    role: 'user',
    image: 'no need',
    token: jwt.sign({id: userTwoId}, process.env.JWT_SECRET)
};

const userThreeId = new mongoose.Types.ObjectId();
const userThree = {
    _id: userThreeId,
    username: 'tong3333',
    password: 'password',
    title: 'I am user 3',
    role: 'admin',
    image: 'no need',
    token: jwt.sign({id: userThreeId}, process.env.JWT_SECRET)
};

const setupDatabase = async () => {
    await User.deleteMany();

    await new User(userOne).save();
    await new User(userTwo).save();
    await new User(userThree).save();
};

module.exports = {
    userOne,
    userTwo,
    userThree,
    setupDatabase
}