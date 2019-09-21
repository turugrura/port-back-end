const User = require('../models/userModel');
const Post = require('../models/postModel');
const mongoose = require('mongoose')

const AppError = require('../utils/appError');
const { handlerSuccess } = require('./handlerResponse');
const { getDataAllowedSave } = require('../utils/manipulateReq');

exports.getPost = async (req, res, next) => {
    try {
        const { userId, postId } = req.params;

        let post;
        let filter = { user: {}, post: {}};
        if(userId) filter.user._id = userId;
        if(postId) filter.post._id = postId;

        if(req.baseUrl.includes('users')) {
            post = await User.find(filter.user).populate({
                path: 'posts',
                match: { _id: postId }
            });
        } else {
            post = await Post.find(filter.post);

            if(post.length === 0) {
                return next(new AppError('Post not found.', 404));
            };
        };

        handlerSuccess(res, 200, post);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

exports.getPosts = async (req, res, next) => {
    try {
        // const posts = await Post.find();
        const { userId } = req.params;
        
        let posts;
        let count = 0;
        let filter = {};
        if(userId) filter._id = userId;

        if(req.baseUrl.includes('users')) {
            posts = await User.find(filter).populate({
                path: 'posts'
            });

            posts.forEach( user => {
                count += user.posts.length;
            });
        } else {
            // posts = await Post.find();
            const page = req.query.page * 1 || 1;
            const limit = 100;
            const skip = (page - 1) * limit;
            posts = await Post.find().populate({
                path: 'author',
                select: ['title', 'image']
            }).sort({
                createdAt: '-1'
            }).skip(skip).limit(limit);
            count = posts.length;
        }

        handlerSuccess(res, 200, posts, count);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

exports.createPost = async (req, res, next) => {
    try {
        const author = req.user._id;
        const allowedField = ['content'];
        const data = getDataAllowedSave(allowedField, req.body);
        
        const post = await new Post({
            author,
            ...data
        }).save();

        handlerSuccess(res, 201, post);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

exports.updatePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const allowedField = ['content', 'like'];
        const data = getDataAllowedSave(allowedField, req.body);

        const post = await Post.findById(postId);
        if(post.author.toString() != req.user._id) {
            return next(new AppError('No permission to update post.', 401));
        };

        const updatedPost = await Post.findByIdAndUpdate(postId, data, {
            new: true,
            runValidators: true
        });
        if(!updatedPost) {
            return next(new AppError('Post not found.', 404));
        };

        handlerSuccess(res, 200, updatedPost);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

exports.updatePostLike = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { postId } = req.params;
        
        if (!postId) return next(new AppError('There are no user or post.', 400));

        const post = await Post.findById(postId);
        if (!post) return next(new AppError('Post not found.', 404));
        
        const idxLike = post.like.findIndex( id => id.toString() == userId);
        if (idxLike < 0) {
            post.like.push(userId);
        } else {
            post.like.splice(idxLike, 1);
        };

        const updatedPost = await post.save();
        handlerSuccess(res, 200, updatedPost);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if(post.author.toString() != req.user._id) {
            return next(new AppError('No permission to delete post.', 401));
        };

        const deletedPost = await Post.findByIdAndDelete(postId);
        if(!deletedPost) {
            return next(new AppError('Post not found.', 404));
        };

        handlerSuccess(res, 200, []);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

exports.checkPostExist = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);
        if(!post){
            return next(new AppError('Post not found.', 404));
        };

        next();
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};