const Post = require('../models/post');

const { handlerError, handlerSuccess } = require('./handlerResponse');
const { getDataAllowedSave } = require('../utils/manipulateReq');

exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        handlerSuccess(res, 200, post);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find();

        handlerSuccess(res, 200, posts, posts.length);
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
        const { id } = req.params;
        const allowedField = ['content', 'like'];
        const data = getDataAllowedSave(allowedField, req.body);

        const updatedPost = await Post.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
        if(!updatedPost) {
            handlerError(res, 400, 'post not found');
        };

        handlerSuccess(res, 200, updatedPost);
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPost = await Post.findByIdAndDelete(id);
        if(!deletedPost) {
            handlerError(res, 400, 'post not found');
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
            handlerError(res, 400, 'post not found');
        };

        next();
    } catch (error) {
        handlerError(res, 400, error.message);
    }
};