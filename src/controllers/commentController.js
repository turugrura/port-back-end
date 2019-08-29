const Comment = require('../models/commentModel');
const Post = require('../models/post');

const { handleError, handleSuccess } = require('./handlerResponse');
const { getDataAllowedSave } = require('../utils/manipulateReq');

const getComments = async (req, res) => {
    try {
        const comments = await Comment.find();

        handleSuccess(res, 200, comments, comments.length);
    } catch (error) {
        handleError(res, 400, error.message);
    }
};

const getComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        handleSuccess(res, 200, comment);
    } catch (error) {
        handleError(res, 400, error.message);
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
            throw new Error('no comment was created');
        }

        handleSuccess(res, 201, newComment);
    } catch (error) {
        handleError(res, 400, error.message);
    }
};

const updateComment = async (req, res) => {
    try {
        const allowedSave = ['content'];
        const data = getDataAllowedSave(allowedSave, req.body);
        
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, data, {
            new: true
        });
        if(!updatedComment) {
            throw new Error('comment not found')
        };

        handleSuccess(res, 200, updatedComment);
    } catch (error) {
        handleError(res, 400, error.message);        
    }
};

const deleteComment = async (req, res) => {
    try {
        const deletedComment = await Comment.findByIdAndDelete(req.params.id);
        if(!deletedComment) {
            throw new Error('comment not found')
        };

        handleSuccess(res, 200, []);
    } catch (error) {
        handleError(res, 400, error.message);        
    }
};

module.exports = {
    getComment,
    getComments,
    createComment,
    updateComment,
    deleteComment
}