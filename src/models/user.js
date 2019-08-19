const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const saltRound = 8;

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        lowercase: true,
        required: [true, 'username required!'],
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
        trim: true
    },
    title: {
        type: String,
        default: 'no title'
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next){
    const user = this;
    try {
        user.password = await bcrypt.hash(user.password, saltRound);        
    } catch (error) {
        throw new Error('encript password has something error!');
    }

    next();
});

module.exports = mongoose.model('User', userSchema);