const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const { handlerError, handlerSuccess } = require('./handlerResponse');
const { getDataAllowedSave } = require('../utils/manipulateReq');

const getComment = async (req, res) => {
    try {
        // const comment = await Comment.findById(req.params.commentId);

        const { userId, postId, commentId } = req.params;
        let comment;
        let filter = { user: {}, post: {}};
        if(userId) filter.user._id = userId;
        if(postId) filter.post._id = postId;
        
        if(req.baseUrl.includes('users')) {
            if(req.baseUrl.includes('posts')) {
                comment = await User.find(filter.user).populate({
                    path: 'posts',
                    match: filter.post,
                    populate: {
                        path: 'comments',
                        match: { _id: commentId }
                    }
                });
            } else {
                comment = await User.find(filter.user).populate({
                    path: 'comments',
                    match: { _id: commentId }
                });
            }
        } else {
            if(req.baseUrl.includes('posts')) {
                comment = await Post.find(filter.post).populate({
                    path: 'comments',
                    match: { _id: commentId }
                });
            } else {
                comment = await Comment.find({ _id: commentId });
            }
        }

        handlerSuccess(res, 200, comment);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

const getComments = async (req, res) => {
    try {
        // const comments = await Comment.find();
        
        const { userId, postId } = req.params;

        let comments;
        let count = 0;
        let filter = { user: {}, post: {}};
        if(userId) filter.user._id = userId;
        if(postId) filter.post._id = postId;

        // users/userId/posts/postId/comments
        if(req.baseUrl.includes('users')) {
            if(req.baseUrl.includes('posts')) {
                // users/userId/posts/postId/comments
                comments = await User.find(filter.user).populate({
                    path: 'posts',
                    match: {
                        ...filter.post
                    },
                    populate: { path: 'comments' }
                });

                comments.forEach( user => {
                    user.posts.forEach( post => {
                        count += post.comments.length;
                    });
                });
            } else {
                // users/userId/comments
                comments = await User.find(filter.user).populate({
                    path: 'comments'
                });

                comments.forEach( user => {
                    count += user.comments.length;
                });
            }
        } else {
            if(req.baseUrl.includes('posts')) {
                // posts/postId/comments
                comments = await Post.find(filter.post).populate({
                    path: 'comments'
                });

                comments.forEach( post => {
                    count += post.comments.length;
                });
            } else {
                // comments
                comments = await Comment.find();
                count = comments.length;
            }
        }

        handlerSuccess(res, 200, comments, count);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

const createComment = async (req, res) => {
    try {
        const allowedSave = ['content'];
        const data = getDataAllowedSave(allowedSave, req.body);
        const { postId } = req.params;

        const newComment = await new Comment({
            ...data,
            author: req.user._id,
            post: postId
        }).save();
        if(!newComment) {
            return handlerError(res, 400, 'no comment was created');
        }

        handlerSuccess(res, 201, newComment);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

const updateComment = async (req, res) => {
    try {
        const allowedSave = ['content'];
        const data = getDataAllowedSave(allowedSave, req.body);

        const cm = await Comment.findById(req.params.commentId);
        if(cm.author.toString() != req.user._id) {
            return handlerError(res, 401, 'no permission to update this comment');
        };
        
        const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, data, {
            new: true,
            runValidators: true
        });
        if(!updatedComment) {
            return handlerError(res, 404, 'comment not found');
        };

        handlerSuccess(res, 200, updatedComment);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

const deleteComment = async (req, res) => {
    try {
        const cm = await Comment.findById(req.params.commentId);
        if(cm.author.toString() != req.user._id) {
            return handlerError(res, 401, 'no permission to update this comment');
        };

        const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);
        if(!deletedComment) {
            return handlerError(res, 404, 'comment not found');
        };

        handlerSuccess(res, 200, []);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

module.exports = {
    getComment,
    getComments,
    createComment,
    updateComment,
    deleteComment
}