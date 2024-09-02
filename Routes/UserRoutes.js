const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserController');

router.post('/signup', UserController.signup);
router.delete('/User/:user_id', UserController.deleteUsers);
router.get('/all/users', UserController.getUsers);
router.get('/User/:user_id', UserController.getUserById);
router.put('/User/:user_id', UserController.updateUser);

module.exports = router;
