    import { useState, useEffect } from "react";
    import { Button } from "react-bootstrap";
    import { Link } from "react-router-dom";
    import classes from "./Navbar.module.css";
    import { useSelector, useDispatch } from "react-redux";
    import { themeAction } from "../../store/ThemeSlice";
    import axios from "axios";
    import { load } from "@cashfreepayments/cashfree-js";


    const Navbar = () => {
        const [pageTitle, setPageTitle] = useState("Welcome to Expense Tracker!!!");
        const [totalAmount, setTotalAmount] = useState(0);
        // Use Redux auth.premiumUser as single source of truth for premium status
        const isPremium = useSelector(state => state.auth.premiumUser);
        const dispatch = useDispatch();
        const isDarkTheme = useSelector(state => state.theme.isDarkTheme);
        const isAuth = useSelector(state => state.auth.isAuthenticated);
        const totalexpense = useSelector(state => state.expense.expensedata);
        
        const totalamount = totalexpense.reduce((totalAmount, expense) => {
            return totalAmount + parseInt(expense.amount)
        }, 0)

        // No local isPremium state; auth.premiumUser is authoritative

        useEffect(() => {
            setTotalAmount(totalamount);
        }, [totalamount]);

        if (totalAmount >= "10000") {
            console.log('the amount is greater that 10000');
        }




        const handleCompleteNowClick = () => {
            setPageTitle("Winners never quit, Quitters never win.");
        };

        const handleWelcomePageClick = () => {
            setPageTitle("Welcome to Expense Tracker!!!");
        };

        const activePremiumHandler = () => {
            console.log("Premium Activated!");
            dispatch(themeAction.toggleTheme());
        }


        const buyPremiumHandler = async (e) => {
        e.preventDefault();

        try {
            // Fetch paymentSessionId from backend (send auth token so backend can associate the order with the user)
            const token = localStorage.getItem('token');
            const response = await axios.post("http://localhost:4000/payment/pay", {}, {
                headers: { Authorization: token }
            });
            const paymentSessionId = response.data.paymentSessionId;
            let orderId = response.data.orderId;
            console.log("Payment Session ID:", paymentSessionId);
            if (!paymentSessionId) {
                console.error("Payment session ID not received from backend");
                return;
            }

            const cashfree = await load({
                mode: "sandbox",
            })

            let checkoutOptions = {
                paymentSessionId: paymentSessionId, 
                redirectTarget: "_modal", // opens in the same tab
            }

            //  cashfree.checkout(checkoutOptions);

            // if want to open in a modal popup
            const result = await cashfree.checkout(checkoutOptions);

            if (result.error) {
            // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
            console.log("User has closed the popup or there is some payment error, Check for Payment Status");
            console.log(result.error);
        }
        if (result.redirect) {
            // This will be true when the payment redirection page couldnt be opened in the same window
            // This is an exceptional case only when the page is opened inside an inAppBrowser
            // In this case the customer will be redirected to return url once payment is completed
            console.log("Payment will be redirected");
        }
        // After checkout returns (success, error, redirect or close) ask backend for the final status
        // This ensures we handle rejected/failed payments as well as success
        console.log("Checkout result:", result);
            try {
            const resp = await axios.get(`http://localhost:4000/payment/payment-status/${orderId}`, {
                headers: token ? { Authorization: token } : {}
            });
            const data = resp.data;
            // Only mark premium if payment was successful
            if (data.status === 'Success') {
                // update Redux + localStorage via auth slice
                dispatch({ type: 'authentication/setPremium', payload: true });
            } else {
                dispatch({ type: 'authentication/setPremium', payload: false });
            }
            alert("Your payment status is: " + data.status);
        } catch (verifyErr) {
            console.error("Error verifying payment status:", verifyErr);
            alert("Unable to verify payment status right now. Please check later.");
        }
        } catch (err) {
            console.error("Error in Buy Premium:", err);
        }
    };


        
        return (
            <header className={`${classes.header} ${isDarkTheme ? classes.darkTheme : ""}`}>
                <Link to="/welcome" onClick={handleWelcomePageClick}>
                    <div>{pageTitle}</div>
                </Link>
                <nav>
                    <ul>
                        {isAuth && (
                            <li className={classes.profile}>
                                <Link to="/welcome" onClick={handleWelcomePageClick}>Welcome</Link>
                                <p>Your profile is incomplete? <Link to="/completeprofile" type={Button} onClick={handleCompleteNowClick}>Complete Now</Link></p>

                            </li>

                        )}
                    </ul>
                </nav>
                {totalAmount >= 10000 && (
                    <Button variant="primary" onClick={activePremiumHandler}>
                        Activate Premium
                    </Button>
                )}
            {/* Show Buy button only when authenticated and not premium. */}
            {isAuth && !isPremium && (
                <Button variant="primary" onClick={buyPremiumHandler}>Buy Premium</Button>
            )}
            {/* Show premium message only when authenticated AND premium. */}
            {isAuth && isPremium && (
                <p className={classes.profile}>You are a premium user</p>
            )}
            </header>
        );
    }

    export default Navbar;