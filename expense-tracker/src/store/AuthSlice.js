
import { createSlice } from "@reduxjs/toolkit";


const initialAuthState = {
    email: localStorage.getItem('email'),
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    premiumUser: localStorage.getItem('premiumUser') === 'true'
}

const authSlice = createSlice({
    name: 'authentication',
    initialState: initialAuthState,
    reducers: {
        login(state, action) {
               const { email, token, premiumUser } = action.payload;
            state.token = token;
            state.email = email.replace(/[@.]/g, "_");
            state.isAuthenticated = true;
                state.premiumUser = !!premiumUser;
                localStorage.setItem('token', token);
                localStorage.setItem('email', state.email);
                localStorage.setItem('premiumUser', state.premiumUser);
        },
            setPremium(state, action) {
                state.premiumUser = !!action.payload;
                localStorage.setItem('premiumUser', state.premiumUser);
            },
        logout(state) {
            state.token = '';
            state.email = '';
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            localStorage.removeItem('premiumUser');
        }
    }
})


export const authActions = authSlice.actions;

export default authSlice.reducer;