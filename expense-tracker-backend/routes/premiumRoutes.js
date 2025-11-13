const express = require('express'); 
const { authenticate } = require('../middleware/auth');
const premiumController = require('../controllers/showleaderboradController');

const router = express.Router();
router.get('/showleaderboard', authenticate, premiumController.getLeaderboardData);

module.exports = router;