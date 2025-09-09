import React from "react";
import classes from "./ExpenseForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { expenseAction } from "../../store/ExpensesSlice";
import axios from "axios";

const ExpenseForm = ({ showForm, setShowForm, enteredTitle, setEnteredTitle, enteredAmount, setEnteredAmount, enteredDescription, setEnteredDescription }) => {

    const dispatch = useDispatch();
    const isDarkTheme = useSelector(state => state.theme.isDarkTheme);

    const editdata = useSelector(state => state.expense.editexpense);
    const userEmail = useSelector(state=>state.auth.email);
    console.log(userEmail);

    const titleChangeHandler = (event) => {

        setEnteredTitle(event.target.value);
    }

    const amountChangeHandler = (event) => {
        if(event.target.value>=0){
            setEnteredAmount(event.target.value);

        }else{
            alert('please put some positive value');
        }

    }

    const descriptionChangeHandler = (event) => {
        setEnteredDescription(event.target.value);
    }

    const showFormHandler = () => {
        setShowForm(true);
    }

    const cancelFormHandler = () => {
        setShowForm(false);
        sessionStorage.clear();
    }

    async function editdataHandler() {
        try {
            const expenseToEdit = editdata.item;
            // Update the existing expense entry in Firebase using its `id` 
            const updatedExpense = { title: enteredTitle, amount: enteredAmount, description: enteredDescription, };

            await axios.put(`https://expense-tracker-data-eea66-default-rtdb.firebaseio.com/${userEmail}/${expenseToEdit.id}.json`, updatedExpense);

            const updatedExpenseWithId = { id: expenseToEdit.id, ...updatedExpense };
            console.log(updatedExpenseWithId);
            dispatch(expenseAction.updatedata(updatedExpenseWithId));
            // Clear the form and reset the edit state 
            dispatch(expenseAction.editexpense(null));
            setEnteredTitle("");
            setEnteredAmount("");
            setEnteredDescription("");
            setShowForm(false);
        } catch (err) {
            console.log(err.message);
        }
    }

    const cancleeditdataHandler = () => {
        dispatch(expenseAction.editexpense(null));
        setEnteredTitle("");
        setEnteredAmount("");
        setEnteredDescription("");
        setShowForm(false);
    }

    async function formSubmitHandler(event) {
        event.preventDefault();
        const ExpenseData = {
            title: enteredTitle,
            amount: enteredAmount,
            description: enteredDescription,
        }
        // Expensectx.addexpense(ExpenseData);
        
        try {
            const response = await axios.post(`https://expense-tracker-data-eea66-default-rtdb.firebaseio.com/${userEmail}.json`, ExpenseData)
            const newexpense = { id: response.data.name, ...ExpenseData };
            dispatch(expenseAction.addexpense(newexpense));
        } catch (err) {
            console.log(err.message);
        }





        setEnteredTitle("");
        setEnteredAmount("");
        setEnteredDescription("");
        setShowForm(false);
    }

    return (
        <>
                <div className={`${classes["centered-container"]}  ${isDarkTheme ? classes.darkTheme : ""}`}>
                    {showForm ? (
                        <div className={`${classes["form-box"]} ${isDarkTheme ? classes.darkTheme : ""}`}>
                            <form onSubmit={formSubmitHandler}>
                                <div className={`${classes["new-expense__controls"]} ${isDarkTheme ? classes.darkTheme : ""}`}>
                                    <div className={classes["new-expense__control"]}>
                                        <label htmlFor="amount">Amount</label>
                                        <input
                                            type="number"
                                            id="amount"
                                            value={enteredAmount}
                                            onChange={amountChangeHandler}
                                        />
                                    </div>

                                    <div className={classes["new-expense__control"]}>
                                        <label htmlFor="description">Description</label>
                                        <input
                                            type="text"
                                            id="description"
                                            value={enteredDescription}
                                            onChange={descriptionChangeHandler}
                                        />
                                    </div>

                                    <div className={classes["new-expense__control"]}>
                                        <label htmlFor="title">Title</label>
                                        <select
                                            id="title"
                                            value={enteredTitle}
                                            onChange={titleChangeHandler}
                                        >
                                            <option value="">Select Title</option>
                                            <option>Food</option>
                                            <option>Petrol</option>
                                            <option>Salary</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={classes["new-expense__actions"]}>
                                    {editdata ? <button onClick={cancleeditdataHandler}>Cancle</button> : <button type="button" onClick={cancelFormHandler}>
                                        Close
                                    </button>}
                                    {editdata ? <button type="button" onClick={editdataHandler}>Edit</button> : <button type="submit">Add Expense</button>}
                                </div>
                            </form>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={showFormHandler}
                            className={classes["add-expense-button"]}
                        >
                            Add Expense
                        </button>
                    )}
                </div>

        </>
    );
}

export default ExpenseForm;