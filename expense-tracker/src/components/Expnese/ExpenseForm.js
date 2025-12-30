import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { expenseAction } from "../../store/ExpensesSlice";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Paper,
  Container,
} from "@mui/material";

const ExpenseForm = ({
  showForm,
  setShowForm,
  enteredTitle,
  setEnteredTitle,
  enteredAmount,
  setEnteredAmount,
  enteredDescription,
  setEnteredDescription,
}) => {
  const dispatch = useDispatch();
  const isDarkTheme = useSelector((state) => state.theme.isDarkTheme);
  const editdata = useSelector((state) => state.expense.editexpense);
  const token = useSelector((state) => state.auth.token);

  const titleChangeHandler = (event) => {
    setEnteredTitle(event.target.value);
  };

  const amountChangeHandler = (event) => {
    if (event.target.value >= 0) {
      setEnteredAmount(event.target.value);
    } else {
      alert("please put some positive value");
    }
  };

  const descriptionChangeHandler = (event) => {
    setEnteredDescription(event.target.value);
  };

  const showFormHandler = () => {
    setShowForm(true);
  };

  const cancelFormHandler = () => {
    setShowForm(false);
    
  };

  async function editdataHandler() {
    try {
      const expenseToEdit = editdata.item;
      const updatedExpense = {
        title: enteredTitle,
        amount: enteredAmount,
        description: enteredDescription,
      };
      await axios.put(
        `http://localhost:4000/expense/update-expense/${expenseToEdit.id}`,
        updatedExpense,
        { headers: { Authorization: token } }
      );

      const updatedExpenseWithId = { id: expenseToEdit.id, ...updatedExpense };
      dispatch(expenseAction.updatedata(updatedExpenseWithId));
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
    dispatch(expenseAction.addexpense(editdata.item));
    setEnteredTitle("");
    setEnteredAmount("");
    setEnteredDescription("");
    setShowForm(false);
  };

  async function formSubmitHandler(event) {
    event.preventDefault();
    const ExpenseData = {
      title: enteredTitle,
      amount: enteredAmount,
      description: enteredDescription,
    };
    // Expensectx.addexpense(ExpenseData);

    try {
      const response = await axios.post(
        `http://localhost:4000/expense/add-expense`,
        ExpenseData,
        { headers: { Authorization: token } }
      );
      console.log(response);
      const newexpense = { id: response.data.expense.id, ...ExpenseData };
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
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper
        sx={{
          padding: 3,
          borderRadius: 2,
          background: isDarkTheme
            ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
            : "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {showForm ? (
          <Box component="form" onSubmit={formSubmitHandler} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Amount"
              type="number"
              id="amount"
              value={enteredAmount}
              onChange={amountChangeHandler}
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiInputBase-input": {
                  color: isDarkTheme ? "#fff" : "#333",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: isDarkTheme ? "#555" : "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: isDarkTheme ? "#888" : "#999",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#9f5ccc",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: isDarkTheme ? "#aaa" : "#666",
                },
              }}
            />

            <TextField
              label="Description"
              type="text"
              id="description"
              value={enteredDescription}
              onChange={descriptionChangeHandler}
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiInputBase-input": {
                  color: isDarkTheme ? "#fff" : "#333",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: isDarkTheme ? "#555" : "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: isDarkTheme ? "#888" : "#999",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#9f5ccc",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: isDarkTheme ? "#aaa" : "#666",
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel sx={{ color: isDarkTheme ? "#aaa" : "#666" }}>
                Title
              </InputLabel>
              <Select
                id="title"
                value={enteredTitle}
                onChange={titleChangeHandler}
                label="Title"
                sx={{
                  color: isDarkTheme ? "#fff" : "#333",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: isDarkTheme ? "#555" : "#ccc",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: isDarkTheme ? "#888" : "#999",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#9f5ccc",
                  },
                }}
              >
                <MenuItem value="">Select Title</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Petrol">Petrol</MenuItem>
                <MenuItem value="Salary">Salary</MenuItem>
              </Select>
            </FormControl>

            <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
              {editdata ? (
                <Button
                  variant="outlined"
                  onClick={cancleeditdataHandler}
                  sx={{
                    color: isDarkTheme ? "#fff" : "#666",
                    borderColor: isDarkTheme ? "#555" : "#ccc",
                    "&:hover": {
                      borderColor: "#9f5ccc",
                      color: "#9f5ccc",
                    },
                  }}
                >
                  Cancel
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outlined"
                  onClick={cancelFormHandler}
                  sx={{
                    color: isDarkTheme ? "#fff" : "#666",
                    borderColor: isDarkTheme ? "#555" : "#ccc",
                    "&:hover": {
                      borderColor: "#9f5ccc",
                      color: "#9f5ccc",
                    },
                  }}
                >
                  Close
                </Button>
              )}
              {editdata ? (
                <Button
                  type="button"
                  variant="contained"
                  onClick={editdataHandler}
                  sx={{
                    background: "linear-gradient(135deg, #9f5ccc 0%, #6d28d9 100%)",
                    color: "white",
                    "&:hover": {
                      background: "linear-gradient(135deg, #6d28d9 0%, #5a24b0 100%)",
                    },
                  }}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    background: "linear-gradient(135deg, #9f5ccc 0%, #6d28d9 100%)",
                    color: "white",
                    "&:hover": {
                      background: "linear-gradient(135deg, #6d28d9 0%, #5a24b0 100%)",
                    },
                  }}
                >
                  Add Expense
                </Button>
              )}
            </Stack>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <Button
              type="button"
              onClick={showFormHandler}
              variant="contained"
              size="large"
              sx={{
                background: "linear-gradient(135deg, #9f5ccc 0%, #6d28d9 100%)",
                color: "white",
                py: 1.5,
                px: 3,
                fontSize: "1rem",
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(135deg, #6d28d9 0%, #5a24b0 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(109, 40, 217, 0.4)",
                },
              }}
            >
              Add Expense
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ExpenseForm;
