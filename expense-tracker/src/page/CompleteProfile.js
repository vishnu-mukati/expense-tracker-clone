import React, { useState, useEffect } from "react";
import classes from "./CompleteProfile.module.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/AuthSlice";
import { expenseAction } from "../store/ExpensesSlice";

const CompleteProfile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [initialData, setInitialData] = useState({ displayName: "", photoUrl: "" });
    
    const token = useSelector(state=>state.auth.token)
    
 
   const dispatch = useDispatch();
    

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
            console.log(userdata);

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
        <div>
            <div>
                <div className={classes["contact-details-container"]}>
                    <h2>Contact Details</h2>
                    <button
                        type="button"
                        onClick={logOutHandler}
                        className={classes["logout-button"]}
                    >
                        Logout
                    </button>
                </div>
                <div className={classes["centered-container"]}>
                    <div className={classes["form-box"]}>
                        <form onSubmit={submitFormHandler} >
                            <div className={classes["new-expense__controls"]}>
                                <div className={classes["new-expense__control"]}>
                                    <label htmlFor="name">Full Name:</label>
                                    <input type="text" id="name" required value={initialData.displayName} onChange={inputNameHandler} />
                                </div>
                                <div className={classes["new-expense__control"]}>
                                    <label htmlFor="url">Profile Photo URL</label>
                                    <input type="url" id="url" required value={initialData.photoUrl} onChange={inputUrlHandler} />
                                </div>
                            </div>
                            <div className={classes["new-expense__actions"]}>
                                <button type="button">Cancel</button>
                                <button type="submit">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompleteProfile;
