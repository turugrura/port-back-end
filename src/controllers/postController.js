const User = require('../models/user');
const Post = require('../models/post');

const { handlerError, handlerSuccess } = require('./handlerResponse');
const { getDataAllowedSave } = require('../utils/manipulateReq');

exports.getPost = async (req, res) => {
    try {
        const { userId, postId } = req.params;
        // const post = await Post.findById(postId);

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
        }

        handlerSuccess(res, 200, post);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

exports.getPosts = async (req, res) => {
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
            posts = await Post.find();
            count = posts.length;
        }

        handlerSuccess(res, 200, posts, count);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

exports.createPost = async (req, res) => {
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
        handlerError(res, 400, error.message);
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const allowedField = ['content', 'like'];
        const data = getDataAllowedSave(allowedField, req.body);

        const post = await Post.findById(postId);
        if(post.author.toString() != req.user._id) {
            return handlerError(res, 401, 'no permission for this post')
        };

        const updatedPost = await Post.findByIdAndUpdate(postId, data, {
            new: true,
            runValidators: true
        });
        if(!updatedPost) {
            return handlerError(res, 400, 'post not found');
        };

        handlerSuccess(res, 200, updatedPost);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if(post.author.toString() != req.user._id) {
            return handlerError(res, 401, 'no permission for this post')
        };

        const deletedPost = await Post.findByIdAndDelete(postId);
        if(!deletedPost) {
            return handlerError(res, 400, 'post not found');
        };

        handlerSuccess(res, 200, []);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

exports.checkPostExist = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);
        if(!post){
            return handlerError(res, 400, 'post not found');
        };

        next();
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};