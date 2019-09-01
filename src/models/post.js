const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        maxlength: 200,
        required: [true, 'Post must have content']
    },
    like: [{
        type: mongoose.Schema.Types.ObjectId
    }]
}, {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
    id: false
});

postSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'post',
    localField: '_id'
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;