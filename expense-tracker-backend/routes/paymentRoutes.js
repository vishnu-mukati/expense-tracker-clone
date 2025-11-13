const express = require('express');
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();


// router.get('/',paymentController.getpaymentPage);
// Protect payment creation so we can associate orders to authenticated users
router.post('/pay', authenticate, paymentController.processPayment);
// Verification can be called by frontend without auth (return_url) but we also allow auth
router.get('/payment-status/:orderId', paymentController.verifyAndUpdatePayment);

module.exports = router;