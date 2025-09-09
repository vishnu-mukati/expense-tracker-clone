import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import classes from "./Navbar.module.css";
import { useSelector, useDispatch } from "react-redux";
import { themeAction } from "../../store/ThemeSlice";

const Navbar = () => {
    const [pageTitle, setPageTitle] = useState("Welcome to Expense Tracker!!!");
    const [totalAmount, setTotalAmount] = useState(0);

    const dispatch = useDispatch();
    const isDarkTheme = useSelector(state => state.theme.isDarkTheme);
    const totalexpense = useSelector(state => state.expense.expensedata);
    const totalamount = totalexpense.reduce((totalAmount, expense) => {
        return totalAmount + parseInt(expense.amount)
    }, 0)

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

    const isAuth = useSelector(state => state.auth.isAuthenticated);
    return (
        <header className={`${classes.header} ${isDarkTheme ? classes.darkTheme : ""}`}>
            <Link to="/" onClick={handleWelcomePageClick}>
                <div>{pageTitle}</div>
            </Link>
            <nav>
                <ul>
                    {isAuth && (

                        <li className={classes.profile}>
                            <Link to="/" onClick={handleWelcomePageClick}>Welcome</Link>
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
        </header>
    );
}

export default Navbar;