const express = require('express');
const router = express.Router();

const { signup,
        login,
        logout,
        protect} = require('../controllers/authController');
const { getUser,
        getUsers,
        createUser, 
        updateUser, 
        deleteUser, 
        getMe, 
        updateMe,
        deleteMe,
        getUserTodos, 
        getUsersTodos } = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', protect, logout);

router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/todos')
    .get(getUsersTodos);    

router.route('/me')
    .get(protect, getMe, getUser)
    .patch(protect, updateMe)
    .delete(protect, deleteMe);

router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

router.route('/:id/todos')
    .get(getUserTodos);

module.exports = router;