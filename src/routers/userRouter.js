const express = require('express');
const router = express.Router();

const { 
    signup,
    login,
    logout,
    protect
} = require('../controllers/authController');
const { 
    getUser,
    getUsers,
    createUser, 
    updateUser, 
    deleteUser, 
    getMe, 
    updateMe,
    deleteMe,
    updateUserImage,
    resizeUserImage,
    changePasswordMe
} = require('../controllers/userController');
const todoRouter = require('./todoRouter');
const postRouter = require('./postRouter');
const commentRouter = require('./commentRouter');

router.use('/todos', todoRouter);
router.use('/:userId/todos', todoRouter);
router.use('/posts', postRouter);
router.use('/:userId/posts', postRouter);
router.use('/comments', commentRouter);
router.use('/:userId/comments', commentRouter);

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', protect, logout);

router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/me')
    .get(protect, getMe, getUser)
    .patch(protect, updateUserImage, resizeUserImage, updateMe)
    .delete(protect, deleteMe);
router.route('/me/changepassword')
    .patch(protect, changePasswordMe);

router.route('/:userId')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;