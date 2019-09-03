const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const {
    userOne,
    userTwo,
    userThree,
    setupDatabase
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('should get users', async () => {
    const res = await request(app)
        .get('/users')
        .expect(200);
    
    // exist 3 user
    const { data } = res.body;
    expect(data.length).toBe(3);
});

test('should get one user', async () => {
    const res = await request(app)
        .get(`/users/${userTwo._id}`)
        .expect(200);

    const { username, password, title } = res.body.data[0];
    expect(username).toBe(userTwo.username);
    expect(password).not.toEqual(userTwo.password);
    expect(title).toBe(userTwo.title);
})

test('should create new user', async () => {
    const testUser = {
        username: 'testnaja',
        password: '12345678'
    };
    const newUser = await request(app)
        .post('/users')
        .send(testUser)
        .expect(201);
    
    // check from DB
    const user = await User.findById(newUser.body.data._id);
    expect(user.username).toBe(testUser.username);
    expect(user.password).not.toBe(testUser.password);
});

test('should not create new user', async () => {
    // user already exist
    await request(app)
        .post('/users')
        .send(userOne)
        .expect(400);
    
    // no username
    await request(app)
        .post('/users')
        .send({
            password: '12345678'
        })
        .expect(400);

    // username have space
    await request(app)
        .post('/users')
        .send({
            username: '12345678 10',
            password: '12345678'
        })
        .expect(400);

    // username < 8 chars
    await request(app)
        .post('/users')
        .send({
            username: '1234567',
            password: '12345678'
        })
        .expect(400);

    // no password
    await request(app)
        .post('/users')
        .send({
            username: '12345678'
        })
        .expect(400);

    // password legth < 8 chars
    await request(app)
        .post('/users')
        .send({
            username: '12345679',
            password: '123'
        })
        .expect(400);

    // title > 50
    await request(app)
        .post('/users')
        .send({
            username: '12345678',
            password: '12345678',
            title: '12345678901234567890123456789012345678901234567890X'
        })
        .expect(400);

    // role not in enum
    await request(app)
        .post('/users')
        .send({
            username: '12345678',
            password: '12345678',
            role: 'xxx'
        })
        .expect(400);
});

test('should update user', async () => {
    const updatedUser = await request(app)
        .patch(`/users/${userTwo._id}`)
        .send({
            title: 'title update',
            role: 'user',
            image: 'image update'
        })
        .expect(200);

    // check updated value
    const { title, role, image } = updatedUser.body.data;
    const dbUser = await User.findById(userTwo._id);
    expect(dbUser.title).toBe(title);
    expect(dbUser.role).toBe(role);
    expect(dbUser.image).toBe(image);
});

test('should not update user', async () => {
    // no data update
    await request(app)
        .patch(`/users/${userTwo._id}`)
        .send({
            home: 'no need home'
        })
        .expect(400);
    
    // title > 50 chars
    await request(app)
        .patch(`/users/${userTwo._id}`)
        .send({
            title: '12345678901234567890123456789012345678901234567890X'
        })
        .expect(400);
    
    // role not in enum
    await request(app)
        .patch(`/users/${userTwo._id}`)
        .send({
            role: 'xxx'
        })
        .expect(400);
});

test('should delete user', async () => {
    await request(app)
        .delete(`/users/${userTwo._id}`)
        .send()
        .expect(200);
})

test('should not delete user', async () => {
    await request(app)
        .delete(`/users/${userTwo._id + 1}`)
        .send()
        .expect(400);
})

test('should signup', async () => {
    const user = {
        username: 'test1111',
        password: '12345678'
    };

    await request(app)
        .post('/users/signup')
        .send(user)
        .expect(201);
})

test('should not signup', async () => {
    // no username
    await request(app)
        .post('/users/signup')
        .send({
            password: '12345678'
        })
        .expect(400);

    // username have space
    await request(app)
        .post('/users/signup')
        .send({
            username: '12345678 9',
            password: '12345678'
        })
        .expect(400);

    // username < 8 chars
    await request(app)
        .post('/users/signup')
        .send({
            username: '1234567',
            password: '12345678'
        })
        .expect(400);

    // no password
    await request(app)
        .post('/users/signup')
        .send({
            username: '12345678'
        })
        .expect(400);

    // password < 8 chars
    await request(app)
        .post('/users/signup')
        .send({
            username: '12345678',
            password: '1234567'
        })
        .expect(400);

    // title > 50 chars
    await request(app)
        .post('/users/signup')
        .send({
            username: '1234567',
            password: '12345678',
            title: '12345678901234567890123456789012345678901234567890X'
        })
        .expect(400);
})

test('should login', async () => {
    const res = await request(app)
        .post('/users/login')
        .send({
            ...userTwo
        })
        .expect(200);
    
    // check new token
    expect(res.body.token).not.toBe(userTwo.token);
});

test('should not login', async () => {
    // wrong username
    await request(app)
        .post('/users/login')
        .send({
            ...userTwo,
            username: userTwo.username + 1
        })
        .expect(400);

    // wrong password
    await request(app)
        .post('/users/login')
        .send({
            ...userTwo,
            password: userTwo.password + 1
        })
        .expect(400);
});

test('should logout with authorization', async () => {
    await request(app)
        .post('/users/logout')
        .set('Authorization', `Bearer ${userTwo.token}`)
        .expect(200);
});

test('should not logout with unthorization', async () => {
    await request(app)
        .post('/users/logout')
        .set('Authorization', `Bearer ${userTwo.token + 1}`)
        .expect(401);
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
        .set('Authorization', `Bearer ${userTwo.token + 1}`)
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
        .set('Authorization', `Bearer ${userTwo.token + 1}`)
        .send()
        .expect(401);
});