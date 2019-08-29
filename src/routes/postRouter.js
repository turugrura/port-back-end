const express = require('express');
const router = express.Router();

const {
    protect
} = require('../controllers/authController');
const {
    getPost,
    getPosts,
    createPost,
    updatePost,
    deletePost
} = require('../controllers/postController');
const commentRouter = require('./commentRouter');

router.use('/:postId/comments', commentRouter);

router.route('/')
    .get(getPosts)
    .post(protect, createPost);

router.route('/:id')
    .get(getPost)
    .patch(protect, updatePost)
    .delete(protect, deletePost);

module.exports = router;