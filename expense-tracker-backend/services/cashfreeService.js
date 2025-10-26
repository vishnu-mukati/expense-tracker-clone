
// import { Cashfree, CFEnvironment } from "cashfree-pg"; 
const { Cashfree, CFEnvironment } = require("cashfree-pg");

const cashfree = new Cashfree(CFEnvironment.SANDBOX, "TEST430329ae80e0f32e41a393d78b923034", "TESTaf195616268bd6202eeb3bf8dc458956e7192a85");

exports.createOrder = async (
    orderId,
    orderAmount,
    orderCurrency = "INR",
    customerID,
    customerPhone,
) => {
    try {

        const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes from now
        const formatedExpiryDate = expiryDate.toISOString();

        const request = {
            order_Id : orderId,
            order_amount: orderAmount,
            order_currency: orderCurrency,
            customer_details: {
                customer_id: customerID,
                customer_phone: customerPhone,
            },
            order_meta: {
                "return_url": "https://localhost:4000/payment/payment-status/" + orderId,
                payment_methods: "cc,upi,nb",
            },
            order_expiry_time: formatedExpiryDate,
        }
        const response = await cashfree.PGCreateOrder(request);
        return response.data.payment_session_id;
    } catch (error) {
        throw new Error("Error creating order");
    }
};

exports.getPaymentStatus = async (orderId) => {
    try {
         console.log('Checking payment status for order:', orderId); 
        const response = await cashfree.PGOrderFetchPayments(orderId);
        let getOrderResponse = response.data;
        console.log("getpaymentstatus function Payment Fetch Response:", getOrderResponse);
        let orderStatus;

        if (getOrderResponse.filter(transaction => transaction.payment_status === "SUCCESS").length > 0) {
            orderStatus = "Success"
        } else if (getOrderResponse.filter(transaction => transaction.payment_status === "PENDING").length > 0) {
            orderStatus = "Pending"
        } else {
            console.log("yes this order is falied due to some reasons");
            orderStatus = "Failure"
        }
        console.log("Fetched Order Status:", orderStatus);
        return orderStatus;
    }catch(err){
        console.error("Error fetching payment status:", err);
        // On error, return a Failure so callers receive a deterministic status
        return "Failure";
    }
}


