const express = require('express');
const expenseController = require('../controllers/expenseController');
const router = express.Router();


router.post('/add-expense', expenseController.addExpense);
router.get('/get-expenses/:userId',expenseController.getExpenses);

module.exports = router;