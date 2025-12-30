import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/AuthSlice";
import { expenseAction } from "../store/ExpensesSlice";
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const CompleteProfile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [initialData, setInitialData] = useState({ displayName: "", photoUrl: "" });
    
    const token = useSelector(state=>state.auth.token)
    
 
   const dispatch = useDispatch();
    
   useEffect(()=>{
     setTimeout(() => {
         dispatch(authActions.logout());
     }, 5000);
     return () => clearTimeout();
   },[])

    const inputNameHandler = (event) => {
        setInitialData((prevState) => ({
            ...prevState, displayName: event.target.value
        }))
    }

    const inputUrlHandler = (event) => {
        setInitialData((prevState) => ({
            ...prevState, photoUrl: event.target.value
        }))
    }


    const logOutHandler = () => {
        dispatch(authActions.logout());
        dispatch(expenseAction.clearExpenses())
    }

    useEffect(() => {
        getdata();
    }, [])

    async function getdata() {
        try {
            const response = await axios.post("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDHMqQkqmIyImQE6qLDutjgiQ4dNMSFKVw", { "idToken": token })
           
            const userdata = response.data.users[0];

            setInitialData({ displayName: userdata.displayName, photoUrl: userdata.photoUrl });
        } catch (err) {
            console.log(err.message);
        }
    }

    async function submitFormHandler(event) {
        event.preventDefault();

        const fullName = event.target.name.value;
        const profilePhotoUrl = event.target.url.value;



        setIsLoading(true);

        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDHMqQkqmIyImQE6qLDutjgiQ4dNMSFKVw';

        try {
            const response = await axios.post(url, {
                idToken: token,
                displayName: fullName,
                photoUrl: profilePhotoUrl,
                returnSecureToken: true
            })
            setIsLoading(false);
            if (response.status === 200) {
                console.log('Profile updated successfully');
            }
        } catch (err) {
            console.log(err.message);
        }

    };

    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper
          sx={{
            padding: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #4f46e5 0%, #9f5ccc 100%)",
            color: "white",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Contact Details
            </Typography>
            <Button
              type="button"
              onClick={logOutHandler}
              variant="contained"
              startIcon={<LogoutIcon />}
              sx={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                },
              }}
            >
              Logout
            </Button>
          </Stack>

          {/* Form */}
          <Box component="form" onSubmit={submitFormHandler} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Full Name"
              type="text"
              id="name"
              required
              value={initialData.displayName}
              onChange={inputNameHandler}
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: "white" } }}
              sx={{
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                  "&:hover fieldset": { borderColor: "white" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
              }}
            />

            <TextField
              label="Profile Photo URL"
              type="url"
              id="url"
              required
              value={initialData.photoUrl}
              onChange={inputUrlHandler}
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: "white" } }}
              sx={{
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                  "&:hover fieldset": { borderColor: "white" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
              }}
            />

            <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end", mt: 2 }}>
              <Button
                type="button"
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  "&:hover": {
                    borderColor: "white",
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                  color: "#000",
                  fontWeight: 600,
                  "&:hover": {
                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  },
                }}
              >
                Update
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    );
};

export default CompleteProfile;
