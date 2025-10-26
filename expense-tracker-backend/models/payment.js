const {DataTypes} = require('sequelize');
const sequelize = require('../utils/db-connection');

const Payment = sequelize.define('payment',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId:{
        type: DataTypes.STRING,
        allowNull: false
    },
    paymentSessionId : {
        type: DataTypes.STRING,
        allowNull: false
    },
    orderAmount:{
        type: DataTypes.FLOAT,
        allowNull: false        
    },
    orderCurrency:{
        type: DataTypes.STRING,
        allowNull: false        
    },       
    status:{
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = Payment;