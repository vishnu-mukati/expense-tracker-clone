import React, { useEffect } from "react";
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
  console.log(userEmail);


  useEffect(() => {
    if (!dataloaded) {
      getdata();
    }
  }, [dataloaded]);
  async function getdata() {
    try {
      const response = await axios.get(`https://expense-tracker-data-eea66-default-rtdb.firebaseio.com/${userEmail}.json`);

      if (response.data.null) {
        
        // dispatch(expenseAction.addexpense([]));
      } else {
        for (const key of Object.keys(response.data)) {
          const expenseData = {
            id: key,
            ...response.data[key],
          };
          // Dispatch each expense as an individual object
          dispatch(expenseAction.addexpense(expenseData));
        }
      }

      dispatch(expenseAction.dataloaded());
    } catch (err) {
      console.log(err.message);
    }
  }

  async function deleteExpenseHandler(id) {
    try {
      await axios.delete(`https://expense-tracker-data-eea66-default-rtdb.firebaseio.com/${userEmail}/${id}.json`)
      console.log('Expense successfuly deleted');
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

  const data = [["Title", "Amount", "Description"]]

  for (const expense of expensedata) {
    const row = [expense.title, expense.amount, expense.description];
    data.push(row);
  }

return (
  <>
    <div>
      <CSVLink data={data}>
        <button className={classes.downloadBtn}>Download Expenses</button>
      </CSVLink>
    </div>
    <ul className={`${classes.expenses} ${isDarkTheme ? classes.darkTheme : ""}`}>
      {expensedata.map((item, index) => (
        <li key={index}>
          <p>Amount: {item.amount}</p>
          <p>Title: {item.title}</p>
          <p>Description: {item.description}</p>
          <button onClick={() => deleteExpenseHandler(item.id)}>Delete</button>
          <button onClick={() => editExpenseHandler(item)}>Edit</button>
        </li>
      ))}
    </ul>
  </>
);

}

export default ExpenseList;