const Expense = require("../models/expense");

const addExpense = async (req, res) => {
    try {
        const { title, amount, description, userId } = req.body;
        const expense = await Expense.create({
            title,
            amount,
            description,
            userId,
        });
        res.status(201).json({ expense });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getExpenses = async (req, res) => {
    const { userId } = req.params;
    try {
        const expenses = await Expense.findAll({ where: { userId: userId } });
        res.status(200).json({ expenses });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteExpense = async (req, res) => {
    const { userId, id } = req.params;
    console.log(id);
    try {
        await Expense.destroy({ where: { id: id, userId: userId } });
        res.status(200).json("Expenses Deleted successfully");
    } catch (err) {
        res.status(500).json({ err: "Internal server error" });
    }
};

module.exports = {
    addExpense,
    getExpenses,
    deleteExpense,
};
