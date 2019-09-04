const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../../src/models/user');
const Todo = require('../../src/models/todo');

// test default value
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    username: 'tong11111',
    password: 'password',
    token: jwt.sign({id: userOneId}, process.env.JWT_SECRET),
    titleDefault: 'no title',
    roleDefault: 'user',
    activeDefault: true,
    imageDefault: ''
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

// test default value
const todoOneId = new mongoose.Types.ObjectId();
const todoOne = {
    _id: todoOneId,
    author: userTwoId,
    topic: 'todoOne',
    content: 'content 1',
    statusDefault: 'none'
};

const todoTwoId = new mongoose.Types.ObjectId();
const todoTwo = {
    _id: todoTwoId,
    author: userTwoId,
    topic: 'todoTow',
    content: 'content 2',
    status: 'done'
};

const setupDatabase = async () => {
    await User.deleteMany();
    await Todo.deleteMany();

    await new User(userOne).save();
    await new User(userTwo).save();

    await new Todo(todoOne).save();
    await new Todo(todoTwo).save();
};

module.exports = {
    userOne,
    userTwo,
    todoOne,
    todoTwo,
    setupDatabase
}