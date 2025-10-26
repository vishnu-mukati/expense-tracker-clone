const Expense = require("../models/index");

const addExpense = async (req, res) => {
    try {
        const { title, amount, description } = req.body;

        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const expense = await Expense.Expense.create({
            title,
            amount,
            description,
            userId: req.user.id
        });
        res.status(201).json({ expense });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.Expense.findAll({ where: { userId: req.user.id } });
        res.status(200).json({ expenses });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        await Expense.Expense.destroy({ where: { id: id, userId: req.user.id } });
        res.status(200).json("Expenses Deleted successfully");
    } catch (err) {
        res.status(500).json({ err: "Internal server error" });
    }
};

const updateExpense = async (req, res) => {
    const { id } = req.params;
    const { title, amount, description } = req.body;
    try {
        const expense = await Expense.Expense.findOne({ where: { id: id, userId: req.user.id } });
        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }
        expense.title = title;
        expense.amount = amount;
        expense.description = description;
        expense.userId = req.user.id;
        await expense.save();
        res.status(200).json({ expense });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

    module.exports = {
        addExpense,
        getExpenses,
        deleteExpense,
        updateExpense
};
