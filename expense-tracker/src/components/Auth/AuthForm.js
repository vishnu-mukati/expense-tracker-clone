import { useState } from 'react';
import { useDispatch } from "react-redux";
import axios from 'axios';
import { authActions } from '../../store/AuthSlice';
import { useHistory } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';

const AuthForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const history = useHistory();

  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);



  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
      setPassword('');
    setConfirmPassword('');
  };

  async function formSubmitHandler(event) {
    event.preventDefault();

    const enteredEmail = email;
    const enteredPassword = password;
    const confirmedPassword = confirmpassword;

    setIsLoading(true);

    let url;
    if (isLogin) {
      url = 'http://localhost:4000/user/login';

    } else {

      url = 'http://localhost:4000/user/signup';
      const enteredConfirmedPassword = confirmedPassword;
      if (enteredConfirmedPassword !== enteredPassword) {
        alert('password does not match');
        return;
      }
    };

    let token;

    try {
      const enteredName = name;
      const response = await axios.post(url, {
        name: enteredName,
        email: enteredEmail,
        password: enteredPassword,
        premiumUser: false
      })
      setIsLoading(false);
  // prefer token field from our backend; fallback to idToken if present
  token = response.data.token || response.data.idToken;
      if (!isLogin && response.status === 201) {
        history.push("/auth");
        setIsLogin(true);
      }
      if (isLogin && response.status === 200) {
        // remove any legacy/local stale keys
    dispatch(authActions.login({ email: enteredEmail, token: token, premiumUser: response.data.premiumUser }));        
    localStorage.removeItem('isPremium');
        history.push("/welcome");
      }
       setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      // alert(err.response.data.message || 'Something went wrong!');
      console.log(err);
      alert('Authentication failed! ' + (err.response.data.message || 'Please try again later.'));
      setIsLoading(false);
    }
     

    setName("");
    setEmail("");
    setPassword("");
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
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: 700,
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          {isLogin ? "Welcome Back 👋" : "Create Account ✨"}
        </Typography>

        <Box component="form" onSubmit={formSubmitHandler} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {!isLogin && (
            <TextField
              label="Your Name"
              type="text"
              id="name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
          )}

          <TextField
            label="Your Email"
            type="email"
            id="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <TextField
            label="Your Password"
            type="password"
            id="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

          {!isLogin && (
            <TextField
              label="Confirm Password"
              type="password"
              id="confirm"
              autoComplete="new-password"
              required
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          )}

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
            {isLoading ? "Sending request..." : isLogin ? "Login" : "Sign Up"}
          </Button>

          <Button
            component="a"
            href="/changepassword"
            sx={{
              color: "#fbbf24",
              textTransform: "none",
              fontSize: "0.9rem",
              "&:hover": { color: "white" },
            }}
          >
            Forgot Password?
          </Button>

          <Button
            type="button"
            onClick={switchAuthModeHandler}
            sx={{
              color: "#fbbf24",
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              "&:hover": { color: "white" },
            }}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );

};

export default AuthForm;

