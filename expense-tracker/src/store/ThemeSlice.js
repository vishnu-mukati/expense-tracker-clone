import { createSlice } from "@reduxjs/toolkit";

const initialExpeseState = {
    isDarkTheme : false,
}

const themeSlice = createSlice({
    name : 'theme',
    initialState : initialExpeseState,
    reducers : {
        toggleTheme(state){
            state.isDarkTheme = !state.isDarkTheme;
        }
    }
})



export const themeAction = themeSlice.actions;
export default themeSlice.reducer;