import { createSlice } from "@reduxjs/toolkit";

const initialExpeseState = {
    expensedata: [],
    editexpense: null,
    dataloaded: false,
}

const ExpensesSlice = createSlice({
    name: 'expense',
    initialState: initialExpeseState,
    reducers: {
        addexpense(state, action) {
            state.expensedata = [...state.expensedata, action.payload];
        },
        deleteexpense(state, action) {
            state.expensedata = state.expensedata.filter((expense) => expense.id !== action.payload);
        },
        editexpense(state, action) {
            state.editexpense = action.payload;
        },
        updatedata(state, action) {
            state.expensedata = [...state.expensedata, action.payload];
        },
        dataloaded(state) {
            state.dataloaded = !state.dataloaded;
        },
         clearExpenses(state) {
      state.expensedata = [];
      state.dataloaded = false;
    }
    }

})




export const expenseAction = ExpensesSlice.actions;
export default ExpensesSlice.reducer;

