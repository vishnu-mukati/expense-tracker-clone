import React, { useState, useEffect } from "react";
import classes from "./ExpenseList.module.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { expenseAction } from "../../store/ExpensesSlice";
import { CSVLink } from "react-csv";

const ExpenseList = ({ setFormData }) => {

  const dispatch = useDispatch();
  const expensedata = useSelector(state => state.expense.expensedata);
  const isDarkTheme = useSelector(state => state.theme.isDarkTheme);
  const dataloaded = useSelector(state => state.expense.dataloaded);
  const userEmail = useSelector(state => state.auth.email);
  const token = useSelector(state => state.auth.token);
  const isPremiumUser = useSelector(state => state.auth.premiumUser);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showleaderboard, setShowleaderboard] = useState(false);
  console.log(isPremiumUser);
  useEffect(() => {
    if (!dataloaded) {
      getdata();
    }
  }, [dataloaded]);
  async function getdata() {
    try {
      const response = await axios.get(`http://localhost:4000/expense/get-expenses`, { headers: { "Authorization": token } });
      if (response.data.expenses.length === 0) {
        // dispatch(expenseAction.addexpense([]));
      } else {
        dispatch(expenseAction.getexpense(response.data.expenses));
      }
      dispatch(expenseAction.dataloaded());
    } catch (err) {
      console.log(err.message);
    }
  }

  async function deleteExpenseHandler(id) {
    try {
      await axios.delete(`http://localhost:4000/expense/delete-expense/${id}`, { headers: { "Authorization": token } });
      dispatch(expenseAction.deleteexpense(id));
    } catch (err) {
      console.log(err.message);
    }
  }

  async function editExpenseHandler(item) {
    try {
      dispatch(expenseAction.editexpense({ item }));
      setFormData(item);
      dispatch(expenseAction.deleteexpense(item.id));
    } catch (err) {
      console.log(err.message);
    }
  }

  const handleLeaderboard = async () => {
    const response = await axios.get('http://localhost:4000/premium/showleaderboard', { headers: { "Authorization": token } })
    console.log(response.data);
    setLeaderboard(response.data.data);
    setShowleaderboard(true);
  }
  
  const data = [["Title", "Amount", "Description"]]

  for (const expense of expensedata) {
    const row = [expense.title, expense.amount, expense.description];
    data.push(row);
  }

  return (
    <>
      <div className={classes.buttons}>
        <CSVLink data={data}>
          <button className={classes.downloadBtn}>Download Expenses</button>
        </CSVLink>
        {isPremiumUser && <button className={classes.leaderboardBtn} onClick={() => handleLeaderboard()}>Show Leaderboard</button>}
      </div>
      {showleaderboard && isPremiumUser && (
        <div className={classes.leaderboard}>
          <h2>Leaderboard</h2>
          <ul>
            {leaderboard.map((user) => (
              <li key={user.rank} data-amount={`$${user.totalExpense}`}>
                <span>Rank {user.rank}:</span> {user.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <ul className={`${classes.expenses} ${isDarkTheme ? classes.darkTheme : ""}`}>
        {expensedata.length > 0 ? (
          expensedata.map((item, index) => (
            <li key={index}>
              <p>Amount: {item.amount}</p>
              <p>Title: {item.title}</p>
              <p>Description: {item.description}</p>
              <button onClick={() => deleteExpenseHandler(item.id)}>Delete</button>
              <button onClick={() => editExpenseHandler(item)}>Edit</button>
            </li>
          ))
        ) : (
          <span>No Expense Available</span>
        )}

      </ul>
    </>
  );

}

export default ExpenseList;