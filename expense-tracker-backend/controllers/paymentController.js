const { createOrder , getPaymentStatus} = require("../services/cashfreeService");
const Payments = require('../models/payment');


const processPayment = async(req, res) => {

    const orderId = "order_"+ Date.now();
        const orderAmount = 2000;
        const orderCurrency = "INR";
        const customerID = "1";
        const customerPhone = "9999999999";

    try{
        const paymentSessionId = await createOrder(
            orderId,
            orderAmount,
            orderCurrency,
            customerID,
            customerPhone,
        );

        await Payments.create({
            orderId,
            paymentSessionId,
            orderAmount,
            orderCurrency,
            status: "Pending",
        })
        res.status(201).json({paymentSessionId,orderId});

    }catch(err){
        console.error("Full error:", err);   // ✅ log full error
        if (err.response?.data) {
            console.error("Cashfree response error:", err.response.data);
        }
        res.status(500).json({message : "Error Processing Payment"});
    }
}
    
const verifyAndUpdatePayment = async (req, res) => {
  try {
    const {orderId} = req.params;
     console.log("verifyAndUpdatePayment called for orderId:",orderId);
    if (!orderId) return res.status(400).json({ message: "orderId required" });

    // Ask Cashfree for payments for this order
    const orderStatus = await getPaymentStatus(orderId); // returns 'Success'|'Pending'|'Failure' (your service)
    console.log("Order Status from Cashfree:", orderStatus);
    if (!orderStatus) {
      return res.status(500).json({ message: "Could not fetch order status from Cashfree" });
    }

    // Idempotent DB update: set status (Sequelize)
    await Payments.update(
      { status: orderStatus },
      { where: { orderId } }
    );

    // Return the resolved status to caller
    return res.status(200).json({ status: orderStatus });
  } catch (err) {
    console.error("verifyAndUpdatePayment error:", err);
    return res.status(500).json({ message: "Error verifying payment" });
  }
};

module.exports = {
  processPayment,
  verifyAndUpdatePayment
};
