
import { createSlice } from "@reduxjs/toolkit";


const initialAuthState = {
    email: localStorage.getItem('email'),
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
}

const authSlice = createSlice({
    name: 'authentication',
    initialState: initialAuthState,
    reducers: {
        login(state, action) {
           const { email, token } = action.payload;
            state.token = token;
            state.email = email.replace(/[@.]/g, "_");
            state.isAuthenticated = true;
            localStorage.setItem('token', token);
            localStorage.setItem('email', state.email);
        },
        logout(state) {
            state.token = '';
            state.email = '';
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('email');
        }
    }
})


export const authActions = authSlice.actions;

export default authSlice.reducer;