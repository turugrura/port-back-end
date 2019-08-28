const Post = require('../models/post');
const { handleError } = require('./handleError');

exports.getPost = async (req, res) => {
    try {
        const posts = await Post.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: posts
        });
    } catch (error) {
        handleError(res, 400, error.message);
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find();

        res.status(200).json({
            status: 'success',
            count: posts.length,
            data: posts
        });
    } catch (error) {
        handleError(res, 400, error.message);
    }
};

exports.createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const author = req.user._id;
        const newPost = await new Post({
            author,
            content
        }).save();

        res.status(201).json({
            status: 'success',
            data: newPost
        });
    } catch (error) {
        handleError(res, 400, error.message);
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, like } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(id, {
            content,
            like
        }, {
            new: true,
            runValidators: true
        });
        if(!updatedPost) {
            throw new Error('post not found')
        };

        res.status(200).json({
            status: 'success',
            data: updatedPost
        });
    } catch (error) {
        handleError(res, 400, error.message);
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPost = await Post.findByIdAndDelete(id);
        
        if(!deletedPost) {
            throw new Error('post not found')
        };

        res.status(200).json({
            status: 'success',
            data: []
        });
    } catch (error) {
        handleError(res, 400, error.message);
    }
};