const express = require('express');
const userController = require('../controllers/userController');
const expenseController = require('../controllers/expenseController');
const router = express.Router();

router.post('/signup', userController.UserSignUp);
router.post('/login', userController.UserLogin);
// router.post('/add-expense', expenseController.addExpense);


module.exports = router;