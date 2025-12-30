const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../utils/db-connection');

const getLeaderboardData = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: [
                'id', 
                'name',
                [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('expenses.amount')), 0), 'totalExpense']
            ],
            include: [{
                model: Expense,
                attributes: [],
                required: false
            }],
            group: ['user.id', 'user.name'],
            order: [[sequelize.literal('totalExpense'), 'DESC']],
            raw: true
        });

       
        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            name: user.name,
            totalExpense: parseFloat(user.totalExpense || 0).toFixed(2)
        }));

        res.status(200).json({
            success: true,
            data: leaderboard
        });

    } catch (err) {
        console.error('Leaderboard error:', err);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching leaderboard data'
        });
    }
};

module.exports = {
    getLeaderboardData
}