import { Fragment, useRef } from "react";
import { Nav } from "react-bootstrap";
import axios from "axios";
import classes from "./ChangePassword.module.css";


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
        } catch (err) {
            console.log(err.message);
        }
    }

    return (
        <Fragment>
              <div className={classes.box}>
            <h2>Reset Password</h2>
            <form onSubmit={formSubmitHandler}>
                <div className={classes.control}>
                    <label htmlFor="changepassword">Enter the email with which you have registered</label>
                    <input type="text" id="changepassword" ref={emailInputRef} />
                </div>
                <div className={classes.actions}>
                    <button>Send</button>
                </div>
            </form>

            <p>
                Already a user?
            </p>
            <div className={classes.loginLink}>
            <Nav.Link href="/auth" >
                    LogIn
                </Nav.Link>
            </div>
            </div>
        </Fragment>
    );
}

export default ChangePassword;  