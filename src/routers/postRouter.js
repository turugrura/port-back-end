const express = require('express');
const router = express.Router({
    mergeParams: true
});

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

router.use('/comments', commentRouter);
router.use('/:postId/comments', commentRouter);

router.route('/')
    .get(getPosts)
    .post(protect, createPost);

router.route('/:postId')
    .get(getPost)
    .patch(protect, updatePost)
    .delete(protect, deletePost);

module.exports = router;