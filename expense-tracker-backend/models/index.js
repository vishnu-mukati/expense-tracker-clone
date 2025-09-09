const User = require('./user');
const Expense = require('./expense');

User.hasMany(Expense, {foreginkey : 'userId'})
Expense.hasMany(User, {foreginkey : 'userId'})

module.exports = {
    User,
    Expense
}