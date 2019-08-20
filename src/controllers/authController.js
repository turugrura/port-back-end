const User = require('../models/user');

exports.signup = async (req, res) => {
    try {
        const { username, password, title } = req.body;
        const user = new User({
            username,
            password,
            title
        });

        const newUser = await user.save();
        res.status(201).json({
            status: 'success',
            length: 1,
            data: newUser
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            error
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) {
            throw new Error('username or password is invalid!');
        }
        const user = await User.findByCredentials(username, password);
        const token = await user.generateAuthToken();

        res.status(200).json({
            status: 'success',
            length: 1,
            data: user,
            token
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            error: error.message
        })
    }
};