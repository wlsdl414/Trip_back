const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/api/users', userController.getUsers);
router.get('/idcheck/:id', userController.checkId);
router.post('/user/signin', userController.login);
router.post('/user/signup', userController.join); 

module.exports = router;