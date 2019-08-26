const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Todo must belong to a user.'],
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
        required: [true, 'Todo must have the content'],
        maxlength: [500, 'Content must less than or equal 500 character'],
        validate: {
            validator: function(val) {
                return val.trim();
            },
            message: 'Title is empty'
        }
    }
}, {
    timestamps: true
});

todoSchema.methods.toJSON = function() {
    const obj = this.toObject();

    return obj;
};

todoSchema.pre(/^find/, function(next){
    this.populate({
        path: 'authorId',
        select: '-__v -tokens -password -passwordChangedAt'
    });

    next();
});


const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;