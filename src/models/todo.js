const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
        maxlength: [100, 'Title must less than or equal 100 character'],
        unique: true,
        validate: {
            validator: function(val) {
                return !val.trim();
            },
            message: 'title is empty'
        }
    },
    content: {
        type: String,
        default: 'no content',
        maxlength: [500, 'Content must less than or equal 500 character'],
        validate: {
            validator: function(val) {
                return !val.trim();
            },
            message: 'title is empty'
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Todo', todoSchema);