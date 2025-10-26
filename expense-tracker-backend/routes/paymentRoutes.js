const express = require('express');
const paymentController = require('../controllers/paymentController');
const router = express.Router();


// router.get('/',paymentController.getpaymentPage);
router.post('/pay',paymentController.processPayment);
router.get('/payment-status/:orderId',paymentController.verifyAndUpdatePayment);

module.exports = router;