const express = require('express');
const router = express.Router({
    mergeParams: true
});

const {
    getComment,
    getComments,
    createComment,
    updateComment,
    deleteComment
} = require('../controllers/commentController');
const { protect } = require('../controllers/authController');
const { checkPostExist } = require('../controllers/postController');

router.route('/')
    .get(getComments)
    .post(protect, checkPostExist, createComment);

router.route('/:commentId')
    .get(getComment)
    .patch(protect, updateComment)
    .delete(protect, deleteComment);

module.exports = router;