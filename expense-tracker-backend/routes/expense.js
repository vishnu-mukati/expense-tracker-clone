const express = require('express');
const expenseController = require('../controllers/expenseController');
const router = express.Router();


router.post('/add-expense', expenseController.addExpense);
router.get('/get-expenses/:userId',expenseController.getExpenses);
router.delete('/delete-expense/:userId/:id',expenseController.deleteExpense);

module.exports = router;