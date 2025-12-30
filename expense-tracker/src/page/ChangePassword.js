import { Fragment, useRef } from "react";
import axios from "axios";
import { Container, Paper, Box, TextField, Button, Typography, Stack } from "@mui/material";

const ChangePassword = () => {
  const emailInputRef = useRef();

  async function formSubmitHandler(event) {
    event.preventDefault();
    try {
      await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDHMqQkqmIyImQE6qLDutjgiQ4dNMSFKVw',
        {
          requestType: "PASSWORD_RESET",
          email: emailInputRef.current.value,
        }
      )
      alert("Password reset email sent!");
    } catch (err) {
      console.log(err.message);
      alert("Error sending password reset email");
    }
  }

  return (
    <Fragment>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper
          sx={{
            padding: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #38015c 0%, #6d28d9 100%)",
            color: "white",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 700,
              textAlign: "center",
              letterSpacing: 1,
            }}
          >
            Reset Password
          </Typography>

          <Box component="form" onSubmit={formSubmitHandler} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Enter the email with which you have registered"
              type="email"
              id="changepassword"
              inputRef={emailInputRef}
              required
              variant="outlined"
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

            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                color: "#000",
                fontWeight: 600,
                py: 1.2,
                mt: 1,
                "&:hover": {
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                },
              }}
            >
              Send
            </Button>

            <Typography sx={{ textAlign: "center", fontSize: "0.95rem" }}>
              Already a user?
            </Typography>

            <Button
              component="a"
              href="/auth"
              sx={{
                color: "#fbbf24",
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 500,
                "&:hover": { color: "white" },
              }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Fragment>
  );
}

export default ChangePassword;  