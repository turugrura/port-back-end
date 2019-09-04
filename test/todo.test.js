const request = require('supertest');
const app = require('../src/app');
const Todo = require('../src/models/todo');

const {
    userOne,
    userTwo,
    todoOne,
    todoTwo,
    setupDatabase
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('should get all todos', async () => {
    const res = await request(app)
        .get('/todos')
        .expect(200);

    const { data } = res.body;
    expect(data.length).toBe(2);
});

test('should get one todo', async () => {
    const res = await request(app)
        .get(`/todos/${todoOne._id}`)
        .expect(200);

    expect(res.body.data.length).toBe(1);
});

test('should create todo with authorization', async () => {
    const todoAllField = {
        topic: 'from test',
        content: '  '
    };
    const res1 = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${userOne.token}`)
        .send(todoAllField)
        .expect(201);

    const todo1 = await Todo.findById(res1.body.data._id);
    expect(todo1.author).toEqual(userOne._id);
    expect(todo1.topic).toBe(todoAllField.topic);
    expect(todo1.content).toBe(todoAllField.content);

    const todoSomeField = {
        topic: 'from test x',
        content: ' x '
    };
    const res2 = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${userOne.token}`)
        .send(todoSomeField)
        .expect(201);

    const todo2 = await Todo.findById(res2.body.data._id);
    expect(todo2.author).toEqual(userOne._id);
    expect(todo2.topic).toBe(todoSomeField.topic);
    expect(todo2.content).toBe(todoSomeField.content);
    
    // check default value
    expect(todo2.status).toBe(todoOne.statusDefault);
});

test('should not create todo with unauthorization', async () => {
    const newTodo = {
        topic: 'from test',
        content: 'content from test'
    };
    
    await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${userOne.token + 1}`)
        .send(newTodo)
        .expect(401);
});

test('should not create todo with invalid value', async () => {
    // exist topic
    await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${userOne.token}`)
        .send({
            topic: todoOne.topic,
            content: 'xx'
        })
        .expect(400);

    // no topic
    await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${userOne.token}`)
        .send({
            content: 'content x'
        })
        .expect(400);

    // topic only space
    await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${userOne.token}`)
        .send({
            topic: '   ',
            content: 'content x'
        })
        .expect(400);

    // topic > 100 chars
    await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${userOne.token}`)
        .send({
            topic: '12345678901234567890123456789012345678901234567890' + 
                    '12345678901234567890123456789012345678901234567890X',
            content: 'content x'
        })
        .expect(400);

    // no content
    await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${userOne.token}`)
        .send({
            topic: 'topic x'
        })
        .expect(400);

    // content > 500 chars
    await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${userOne.token}`)
        .send({
            topic: 'topic x',
            content: '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
                    '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
                    '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
                    '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
                    '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890X'
        })
        .expect(400);
});

test('should update todo with authorization', async () => {
    const todo = {
        topic: 'updated topic',
        content: 'updated content',
        status: 'doing'
    };

    await request(app)
        .patch(`/todos/${todoOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send(todo)
        .expect(200);

    const { author, topic, content, status } = await Todo.findById(todoOne._id);
    expect(author).toEqual(todoOne.author);
    expect(topic).toBe(todo.topic);
    expect(content).toBe(todo.content);
    expect(status).toBe(todo.status);
});

test('should not update todo with unautorization', async () => {
    const todo = {
        topic: 'from test'
    };
    
    await request(app)
        .patch(`/todos/${todoOne._id}`)
        .set('Authorization', `Bearer ${userOne.token}`)
        .send(todo)
        .expect(401);

    await request(app)
        .patch(`/todos/${todoOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token + 1}`)
        .send(todo)
        .expect(401);
});

test('should not update todo with invalid value', async () => {
    // exist topic
    await request(app)
        .patch(`/todos/${todoOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send({
            topic: todoTwo.topic
        })
        .expect(400);

    // topic is null
    await request(app)
        .patch(`/todos/${todoOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send({
            topic: null
        })
        .expect(400);

    // topic only space
    await request(app)
        .patch(`/todos/${todoOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send({
            topic: '   '
        })
        .expect(400);

    // topic > 100 chars
    await request(app)
        .patch(`/todos/${todoOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send({
            topic: '12345678901234567890123456789012345678901234567890' + 
                    '12345678901234567890123456789012345678901234567890X'
        })
        .expect(400);

    // content is null
    await request(app)
        .patch(`/todos/${todoOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send({
            content: null
        })
        .expect(400);

    // content > 500 chars
    await request(app)
        .patch(`/todos/${todoOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send({
            content: '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
                    '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
                    '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
                    '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
                    '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890X'
        })
        .expect(400);


    // status is null
    await request(app)
        .patch(`/todos/${todoOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send({
            status: null
        })
        .expect(400);

    // status not in enum
    await request(app)
        .patch(`/todos/${todoOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send({
            status: 'xx'
        })
        .expect(400);
});

test('should delete todo with authorization', async () => {
    await request(app)
        .delete(`/todos/${todoOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .expect(200);

    const todo = await Todo.findById(todoOne._id);
    expect(todo).toBeNull();
});

test('should not delete todo with unauthorization', async () => {
    await request(app)
        .delete(`/todos/${todoOne._id}`)
        .set('Authorization', `Bearer ${userOne.token}`)
        .expect(401);
    
    await request(app)
        .delete(`/todos/${todoOne._id}`)
        .set('Authorization', `Bearer ${userTwo.token + 1}`)
        .expect(401);
});

