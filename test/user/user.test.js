const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../../src/app');

const User = require('../../src/models/user');

const userOne = {
    username: 'tong',
    password: 'password',
    title: 'I from test',
    role: 'admin',
    image: 'no need'
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    username: 'tong2',
    password: 'password',
    title: 'I from test',
    role: 'admin',
    image: 'no need',
    token: jwt.sign({id: userTwoId}, process.env.JWT_SECRET)
};

beforeAll( async () => {
    await User.deleteMany();
    await new User(userTwo).save();
});

test('should get request', async () => {
    await request(app)
        .get('/users')
        .expect(200);
});

test('should create new user', async () => {
    const newUser = await request(app)
        .post('/users')
        .send(userOne)
        .expect(201);
    
    // stored in DB
    const user = await User.findById(newUser.body.data._id);
    expect(user).not.toBeNull();

    // value in DB was correct
    expect(user.username).toBe(userOne.username);
});

test('should login', async () => {
    await request(app)
        .post('/users/login')
        .send({
            ...userOne
        })
        .expect(200);
});

test('should not login', async () => {
    await request(app)
        .post('/users/login')
        .send({
            ...userOne,
            password: 'xxxxx'
        })
        .expect(400);
});

test('should login with new token', async () => {
    const newLogin = await request(app)
                        .post('/users/login')
                        .send(userTwo)
                        .expect(200);
    
    // new token
    const newToken = newLogin.body.token;
    expect(newToken).not.toBe(userTwo.token);

    // new token stored in DB
    const user = await User.find( {_id: userTwo._id, token: newToken})
    expect(user).not.toBeNull();
});


test('should get profile with authorization', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send()
        .expect(200);
});

test('should not get profile with unauthorization', async () => {
    await request(app)
        .get('/users/me')
        .expect(401);
});

test('should delete user with authorization', async () => {
    await request(app)
        .delete(`/users/me`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send()
        .expect(200);
});

test('should not delete user with unauthorization', async () => {
    await request(app)
        .delete(`/users/me`)
        .send()
        .expect(401);
});