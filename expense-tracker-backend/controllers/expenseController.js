const Expense = require('../models/expense');

const addExpense = async(req,res)=>{
    try{
        const {title,amount,description,userId} = req.body;
        console.log(title,amount,description,userId);
        const expense = await Expense.create({title,amount,description,userId});
        res.status(201).json({expense});
    }catch(err){
        res.status(500).json({error: 'Internal Server Error'});
    }
}

const getExpenses = async(req,res)=>{
        const {userId} = req.params;
    try{
        const expenses = await Expense.findAll(
            {where:{userId: userId}}
        );
        res.status(200).json({expenses});
    }catch(err){
        res.status(500).json({error: 'Internal Server Error'});
    }
}


module.exports = {
    addExpense,
    getExpenses
}
   