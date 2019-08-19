const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
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
        trim: true
    },
    title: {
        type: String,
        default: 'no title'
    }
}, {
    timestamps: true
});

// userSchema.statics.findByCredentials = async (username, password) => {
//     const user = this.
// };

userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, saltRound);

    next();
});

module.exports = mongoose.model('User', userSchema);