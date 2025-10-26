const User = require('./user');
const Expense = require('./expense');


    User.hasMany(Expense);
    Expense.belongsTo(User);


module.exports = {
    User,
    Expense
}