const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const saltRound = 8;

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        lowercase: true,
        required: [true, 'username required!'],
        unique: [true, 'username is duplicated!'],
        validate: {
            validator: function(username) {
                return !username.includes(' ');
            },
            message: username => `there are space in '${username.value}'`
        }
    },
    password: {
        type: String,
        required: [true, 'password required!'],
        minlength: [8, 'password must be at least 8 characters'],
        trim: true,
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now()
    },
    title: {
        type: String,
        maxlength: 50,
        default: 'no title'
    },
    role: {
        type: String,
        enum: ['user', 'head', 'admin'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        default: ''
    },
    token: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false
});

userSchema.virtual('todos', {
    ref: 'Todo',
    foreignField: 'author',
    localField: '_id'
});

userSchema.virtual('posts', {
    ref: 'Post',
    foreignField: 'author',
    localField: '_id'
});

userSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'author',
    localField: '_id'
});

userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username, active: true });
    if(!user) {
        throw new Error('username not found');
    };

    const isPassMatch = await bcrypt.compare(password, user.password);
    if(!isPassMatch) {
        throw new Error('password is incorrect!');
    };

    return user;
};

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.passwordChangedAt;
    delete userObject.token;

    return userObject;
};

userSchema.methods.generateAuthToken = async function() {
    const id = this._id.toString();
    const token = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    this.token = token;

    await this.save();
    
    return token;
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const pwChangedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);
        return pwChangedTimestamp > JWTTimestamp;
    };

    return false;
};

userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, saltRound);

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;