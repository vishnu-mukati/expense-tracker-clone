const {DataTypes} = require('sequelize');
const sequelize = require('../utils/db-connection');
const User = require('./user');

const Expense = sequelize.define('expense',{
    id:{
        type: DataTypes.INTEGER,    
        primaryKey: true,
        autoIncrement: true
    },
     title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    amount:{
        type: DataTypes.FLOAT,  
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false
    } 
});

module.exports = Expense;