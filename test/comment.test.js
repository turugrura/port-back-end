const request = require('supertest');
const app = require('../src/app');

const Comment = require('../src/models/commentModel');
const {
    userOne,
    userTwo,
    postOne,
    postTwo,
    commentOne,
    commentTwo,
    setupDatabase
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('should get all comments', async () => {
    const res = await request(app)
        .get('/comments')
        .expect(200);

    expect(res.body.data.length).toBe(2);
});

test('should get one comment', async () => {
    const res = await request(app)
        .get(`/comments/${commentOne._id}`)
        .expect(200);

    expect(res.body.data.length).toBe(1);
});

test('should create comment with authorization', async () => {
    const cm = {
        content: 'test cm'
    };
    const res = await request(app)
        .post(`/posts/${postOne._id}/comments`)
        .set('Authorization', `Bearer ${userOne.token}`)
        .send(cm)
        .expect(201);

    const { content, author, post } = await Comment.findById(res.body.data._id);
    expect(author).toEqual(userOne._id);
    expect(post).toEqual(postOne._id);
    expect(content).toBe(cm.content);
});

test('should not create comment with unautorization', async () => {
    const cm = {
        content: 'test cm'
    };

    // no token
    await request(app)
        .post(`/posts/${postOne._id}/comments`)
        .send(cm)
        .expect(401);

    // invalid token
    await request(app)
        .post(`/posts/${postOne._id}/comments`)
        .set('Authorization', `Bearer ${userOne.token + 1}`)
        .send(cm)
        .expect(401);
});

test('should not create comment with invalid data', async () => {
    // no data
    await request(app)
        .post(`/posts/${postOne._id}/comments`)
        .set('Authorization', `Bearer ${userOne.token}`)
        .send()
        .expect(400);

    // content is null
    await request(app)
        .post(`/posts/${postOne._id}/comments`)
        .set('Authorization', `Bearer ${userOne.token}`)
        .send({
            content: null
        })
        .expect(400);

    // content > 200 chars
    await request(app)
        .post(`/posts/${postOne._id}/comments`)
        .set('Authorization', `Bearer ${userOne.token}`)
        .send({
            content: '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
                    '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
                    'X'
        })
        .expect(400);
});

test('should update comment with authorization', async () => {
    const cm = {
        content: 'test update cm'
    };
    await request(app)
        .patch(`/comments/${commentOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send(cm)
        .expect(200);

    const { content, author, post } = await Comment.findById(commentOne._id);
    expect(author).toEqual(commentOne.author);
    expect(post).toEqual(commentOne.post);
    expect(content).toBe(cm.content);
});

test('should not update comment with unauthorization', async () => {
    const cm = {
        content: 'test cm'
    };

    // no token
    await request(app)
        .patch(`/comments/${commentOne._id}`)
        .send(cm)
        .expect(401);

    // invalid token
    await request(app)
        .patch(`/comments/${commentOne._id}`)
        .set('Authorization', `Bearer ${userOne.token + 1}`)
        .send(cm)
        .expect(401);

    // not be author
    await request(app)
        .patch(`/comments/${commentOne._id}`)
        .set('Authorization', `Bearer ${userOne.token}`)
        .send(cm)
        .expect(401);
});

test('should not update comment with invalid data', async () => {
    // no data
    await request(app)
        .patch(`/comments/${commentOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send()
        .expect(400);

    // content is null
    await request(app)
        .patch(`/comments/${commentTwo._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send({
            content: null
        })
        .expect(400);

    // content > 200 chars
    await request(app)
        .patch(`/comments/${commentTwo._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send({
            content: '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
                    '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
                    'X'
        })
        .expect(400);
});

test('should delete comment with authorization', async () => {
    await request(app)
        .delete(`/comments/${commentOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .expect(200);

    await request(app)
        .delete(`/comments/${commentTwo._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .expect(200);

    const cm1 = await Comment.findById(commentOne._id);
    const cm2 = await Comment.findById(commentTwo._id);
    expect(cm1).toBeNull();
    expect(cm2).toBeNull();
});

test('should not delete comment with unautorization', async () => {
    // no token
    await request(app)
        .delete(`/comments/${commentOne._id}`)
        .expect(401);

    // invalid token
    await request(app)
        .delete(`/comments/${commentTwo._id}`)
        .set('Authorization', `Bearer ${userOne.token + 1}`)
        .expect(401);

    // not be author
    await request(app)
        .delete(`/comments/${commentTwo._id}`)
        .set('Authorization', `Bearer ${userOne.token}`)
        .expect(401);
});
