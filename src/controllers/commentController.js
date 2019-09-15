const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const AppError = require('../utils/appError');
const { handlerSuccess } = require('./handlerResponse');
const { getDataAllowedSave } = require('../utils/manipulateReq');

const getComment = async (req, res, next) => {
    try {
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

                if(comment.length === 0) {
                    return next(new AppError('Comment not found.', 404));
                };
            };
        };

        handlerSuccess(res, 200, comment);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

const getComments = async (req, res, next) => {
    try {
        // const comments = await Comment.find();
        
        const { userId, postId } = req.params;

        const page = req.query.page * 1 || 1;
        const limit = 100;
        const skip = (page - 1) * limit;

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
                comments = await Post.find(filter.post)
                .populate({
                    path: 'author',
                    select: ['title']
                })
                .populate({
                    path: 'comments',
                    select: ['content', 'createdAt']
                })
                .sort({
                    createdAt: -1
                })
                .skip(skip).limit(limit);

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
        next(new AppError(error.message, 400));
    }
};

const createComment = async (req, res, next) => {
    try {
        const allowedSave = ['content'];
        const data = getDataAllowedSave(allowedSave, req.body);
        const { postId } = req.params;

        const newComment = await new Comment({
            ...data,
            author: req.user._id,
            post: postId
        }).save();

        handlerSuccess(res, 201, newComment);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

const updateComment = async (req, res, next) => {
    try {
        const allowedSave = ['content'];
        const data = getDataAllowedSave(allowedSave, req.body);

        const cm = await Comment.findById(req.params.commentId);
        if(!cm) {
            return next(new AppError('Comment not found', 404));
        };
        if(cm.author._id.toString() != req.user._id) {
            return next(new AppError('No permission to update comment.', 401));
        };
        
        const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, data, {
            new: true,
            runValidators: true
        });
        if(!updatedComment) {
            return next(new AppError('Comment not found.', 404));
        };

        handlerSuccess(res, 200, updatedComment);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const cm = await Comment.findById(req.params.commentId);
        if(!cm) {
            return next(new AppError('Comment not found', 404));
        };
        if(cm.author._id.toString() != req.user._id) {
            return next(new AppError('No permission to delete comment.', 401));
        };

        const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);
        if(!deletedComment) {
            return next(new AppError('Comment not found.', 404));
        };

        handlerSuccess(res, 200, []);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

module.exports = {
    getComment,
    getComments,
    createComment,
    updateComment,
    deleteComment
}