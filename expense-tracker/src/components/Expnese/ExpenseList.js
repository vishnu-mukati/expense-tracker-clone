import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { expenseAction } from "../../store/ExpensesSlice";
import { CSVLink } from "react-csv";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";

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
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Download and Leaderboard Buttons */}
      <Stack direction="row" spacing={2} sx={{ mb: 3, justifyContent: "flex-end" }}>
        <CSVLink data={data}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{
              background: "linear-gradient(135deg, #38015c 0%, #6d28d9 100%)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(135deg, #6d28d9 0%, #5a24b0 100%)",
              },
            }}
          >
            Download Expenses
          </Button>
        </CSVLink>
        {isPremiumUser && (
          <Button
            variant="contained"
            onClick={() => handleLeaderboard()}
            sx={{
              background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(135deg, #db2777 0%, #be185d 100%)",
              },
            }}
          >
            Show Leaderboard
          </Button>
        )}
      </Stack>

      {/* Leaderboard */}
      {showleaderboard && isPremiumUser && (
        <Paper
          sx={{
            p: 3,
            mb: 3,
            background: isDarkTheme
              ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
              : "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
            color: isDarkTheme ? "#fff" : "#333",
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            🏆 Leaderboard
          </Typography>
          <List>
            {leaderboard.map((user) => (
              <ListItem
                key={user.rank}
                sx={{
                  background: isDarkTheme ? "#2a2a3e" : "#fff",
                  mb: 1,
                  borderRadius: 1,
                  border: isDarkTheme ? "1px solid #444" : "1px solid #e0e0e0",
                }}
              >
                <ListItemText
                  primary={`Rank ${user.rank}: ${user.name}`}
                  secondary={`Total Expense: $${user.totalExpense}`}
                  secondaryTypographyProps={{
                    sx: { color: isDarkTheme ? "#aaa" : "#666" },
                  }}
                  sx={{ color: isDarkTheme ? "#fff" : "#333" }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Expenses List */}
      <Paper
        sx={{
          p: 3,
          background: isDarkTheme
            ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
            : "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
          color: isDarkTheme ? "#fff" : "#333",
          borderRadius: 2,
        }}
      >
        {expensedata.length > 0 ? (
          <List>
            {expensedata.map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  background: isDarkTheme ? "#2a2a3e" : "#fff",
                  mb: 2,
                  borderRadius: 1.5,
                  border: isDarkTheme ? "1px solid #444" : "1px solid #e0e0e0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                  p: 2,
                }}
              >
                <ListItemText
                  primary={`Title: ${item.title}`}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        Amount: ${item.amount}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2">
                        Description: {item.description}
                      </Typography>
                    </>
                  }
                  secondaryTypographyProps={{
                    sx: { color: isDarkTheme ? "#aaa" : "#666" },
                  }}
                  sx={{ color: isDarkTheme ? "#fff" : "#333" }}
                />
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => deleteExpenseHandler(item.id)}
                    size="small"
                    sx={{
                      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                      },
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => editExpenseHandler(item)}
                    size="small"
                    sx={{
                      background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                      color: "#fff",
                      "&:hover": {
                        background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                      },
                    }}
                  >
                    Edit
                  </Button>
                </Stack>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" sx={{ color: isDarkTheme ? "#aaa" : "#666" }}>
              No Expense Available
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );

}

export default ExpenseList;