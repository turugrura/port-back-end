const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    content: {
        type: String,
        maxlength: 200,
        required: true
    }
}, {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
    id: false
});

commentSchema.pre(/^find/, function(next){
    this.populate({
        path: 'author',
        select: ['username', 'title', 'image']
    });

    next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;