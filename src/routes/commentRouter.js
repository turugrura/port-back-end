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

router.route('/:id')
    .get(getComment)
    .patch(protect, checkPostExist, updateComment)
    .delete(protect, checkPostExist, deleteComment);

module.exports = router;