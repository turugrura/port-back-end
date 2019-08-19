const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = require('../models/user');

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({
            error
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const user = await User.findOne({ _id });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({
            error
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        await User.init();
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({
            error
        });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const notAllowUpdates = ['_id', 'username','createdAt','updatedAt', '__v'];
        notAllowUpdates.forEach(field => {
            delete req.body[field]
        });
        
        const _id = mongoose.Types.ObjectId(req.params.id);
        const updatedUser = await User.updateOne( { _id }, {
            ...req.body
        }, {
            runValidators: true
        })
        if(!updatedUser || updatedUser.nModified === 0) {
            throw new Error().message = 'user not found';
        }
        
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({
            error
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const _id = mongoose.Types.ObjectId(req.params.id);
        const delUser = await User.deleteOne({ _id });
        if(!delUser || delUser.deletedCount === 0) {
            throw new Error().message = 'No user delete'
        }
        res.status(200).json(delUser);
    } catch (error) {
        res.status(400).json({
            error,
            status: 'cannot delete user'
        });
    }
});

module.exports = router;