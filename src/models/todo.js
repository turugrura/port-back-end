const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'todo must have the author'],
        ref: 'User'
    },
    topic: {
        type: String,
        required: true,
        maxlength: [100, 'Topic must less than or equal 100 character'],
        unique: true,
        validate: {
            validator: function(val) {
                return val.trim();
            },
            message: 'Topic is empty'
        }
    },
    content: {
        type: String,
        required: [true, 'todo must have the content'],
        maxlength: [500, 'Content must less than or equal 500 character'],
        validate: {
            validator: function(val) {
                return val.trim();
            },
            message: 'title is empty'
        }
    }
}, {
    timestamps: true
});

todoSchema.virtual('users', {
    ref: 'Users',
    localField: 'authorId',
    foreignField: '_id'
});

todoSchema.methods.toJSON = function() {
    const obj = this.toObject();

    return obj;
};


const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;