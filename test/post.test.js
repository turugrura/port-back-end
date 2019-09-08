const request = require('supertest');
const app = require('../src/app');

const Post = require('../src/models/postModel');
const {
    userOne,
    userTwo,
    postOne,
    postTwo,
    setupDatabase
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('should get all posts', async () => {
    const res = await request(app)
        .get('/posts')
        .expect(200);

    expect(res.body.data.length).toBe(2);
});

test('should get one post', async () => {
    const res = await request(app)
        .get(`/posts/${postOne._id}`)
        .expect(200);

    expect(res.body.data.length).toBe(1);
});

test('should create post with authorization', async () => {
    const post = {
        content: 'post test'
    };
    const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${userOne.token}`)
        .send(post)
        .expect(201);

    const { author, content, like } = await Post.findById(res.body.data._id);
    expect(author).toEqual(userOne._id);
    expect(content).toBe(post.content);
    expect(like.length).toBe(0);
});

test('should not create post with unauthorization', async () => {
    const post = {
        content: 'post test'
    };

    // no token
    await request(app)
        .post('/posts')
        .send(post)
        .expect(401);
    
    // incorrect token
    await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${userOne.token + 1}`)
        .send(post)
        .expect(401);
});

test('should not create post with invalid value', async () => {
    // empty data
    await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${userOne.token}`)
        .send({})
        .expect(400);

    // content is null
    await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${userOne.token}`)
        .send({
            content: null
        })
        .expect(400);

    // content > 200 chars
    await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${userOne.token}`)
        .send({
            content: '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
                    '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
                    'X'
        })
        .expect(400);
});

test('should update post with authorization', async () => {
    const post = {
        content: 'test update'
    };
    await request(app)
        .patch(`/posts/${postOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send(post)
        .expect(200);

    const { content } = await Post.findById(postOne._id);
    expect(content).toBe(post.content);
});

test('should not update post with unauthorization', async () => {
    const post = {
        content: 'post test'
    };

    // no token
    await request(app)
        .patch(`/posts/${postOne._id}`)
        .send(post)
        .expect(401);
    
    // incorrect token
    await request(app)
        .patch(`/posts/${postOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token + 1}`)
        .send(post)
        .expect(401);

    // not be author
    await request(app)
        .patch(`/posts/${postOne._id}`)
        .set('Authorization', `Bearer ${userOne.token}`)
        .send(post)
        .expect(401);
});

test('should not update post with invalid value', async () => {
    // empty data
    await request(app)
        .patch(`/posts/${postOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send({})
        .expect(400);

    // content is null
    await request(app)
        .patch(`/posts/${postOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send({
            content: null
        })
        .expect(400);

    // content > 200 chars
    await request(app)
        .patch(`/posts/${postOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send({
            content: '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
                    '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
                    'X'
        })
        .expect(400);
});

test('should delete post with authorization', async () => {
    await request(app)
        .delete(`/posts/${postOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .expect(200);

    const post = await Post.findById(postOne._id);
    expect(post).toBeNull();
});

test('should not delete post with unauthorization', async () => {
    // no token
    await request(app)
        .delete(`/posts/${postOne._id}`)
        .expect(401);
    
    // incorrect token
    await request(app)
        .delete(`/posts/${postOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token + 1}`)
        .expect(401);

    // not be author
    await request(app)
        .delete(`/posts/${postOne._id}`)
        .set('Authorization', `Bearer ${userOne.token}`)
        .expect(401);
});
