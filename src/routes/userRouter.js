const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userConstroller = require('../controllers/userController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.route('/')
    .get(userConstroller.getUsers)
    .post(userConstroller.createUser);

router.route('/me')
    .get(authController.protect, userConstroller.getMe)
    .patch(authController.protect, userConstroller.updateMe);

router.route('/:id')
    .get(userConstroller.getUser)
    .patch(userConstroller.updateUser)
    .delete(userConstroller.deleteUser);

router.route('/:id/todos')
    .get(userConstroller.getTodos);

module.exports = router;