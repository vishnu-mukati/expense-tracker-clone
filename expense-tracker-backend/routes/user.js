const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/signup', userController.UserSignUp);
router.post('/login', userController.UserLogin);


module.exports = router;