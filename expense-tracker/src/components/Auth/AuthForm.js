import { useState, useRef } from 'react';
import { useDispatch } from "react-redux";
import classes from './AuthForm.module.css';
import axios from 'axios';
import { authActions } from '../../store/AuthSlice';
import { useHistory } from "react-router-dom";

const AuthForm = () => {
  // const nameInputRef = useRef();
  // const emailInputRef = useRef();
  // const passwordInputRef = useRef();
  // const confirmpasswordInputRef = useRef();
   const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [confirmpassword,setConfirmPassword]=useState('');  
  const history = useHistory();

  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);



  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
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
        password: enteredPassword
      })
      setIsLoading(false);

      // if(response && response.data){
      dispatch(authActions.login({ email: enteredEmail, token: response.data.idToken }))

      token = response.data.idToken;
      if (response.status === 200) {
        history.push("/");
      }
    } catch (err) {
      alert(err.response.data.message || 'Something went wrong!');
      console.log(err);
      setIsLoading(false);
    }


    // if (!isLogin) {
    //   try {
    //     const response = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDHMqQkqmIyImQE6qLDutjgiQ4dNMSFKVw',
    //       {
    //         requestType: "VERIFY_EMAIL",
    //         idToken: token,
    //       },
    //     )
    //     history.push("/");
    //   } catch (err) {
    //     console.log(err.message);
    //   }
    // }
  };


  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Welcome Back 👋" : "Create Account ✨"}</h1>
      <form onSubmit={formSubmitHandler}>
        {!isLogin && <div className={classes.control}>
          <label htmlFor="name">Your Name</label>
          <input type="text" id="name" required  onChange={(e) => setName(e.target.value)} />
        </div>}
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required  onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required  onChange={(e) => setPassword(e.target.value)} />
        </div>

        {!isLogin && (
          <div className={classes.control}>
            <label htmlFor="confirm">Confirm Password</label>
            <input
              type="password"
              id="confirm"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        )}

        <div className={classes.actions}>
          <button type="submit">
            {isLoading
              ? "Sending request..."
              : isLogin
                ? "Login"
                : "Sign Up"}
          </button>
        </div>

        <a href="/changepassword" className={classes.forgotPassword}>
          Forgot Password?
        </a>

        <div className={classes.actions}>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </button>
        </div>
      </form>
    </section>
  );

};

export default AuthForm;

