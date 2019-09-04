const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: [true, 'Todo must belong to a user.'],
        ref: 'User'
    },
    topic: {
        type: String,
        required: [true, 'Todo must have the topic'],
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
        maxlength: [500, 'Content must less than or equal 500 character']
    },
    status: {
        type: String,
        enum: ['none', 'undo', 'doing', 'done'],
        default: 'none',
        required: [true, 'Content must have status']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false
});

todoSchema.methods.toJSON = function() {
    const obj = this.toObject();

    return obj;
};

// todoSchema.pre(/^find/, function(next){
//     this.populate({
//         path: 'author',
//         select: 'username'
//     });

//     next();
// });


const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;