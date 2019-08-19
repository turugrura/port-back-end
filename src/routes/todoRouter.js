const express = require('express');
const router = express.Router();

const todoController = require('../controllers/todoController');

router.route('/')
    .get(todoController.getUsers)
    .post(todoController.createUser);

router.route('/:id')
    .get(todoController.ge)

module.exports = router;