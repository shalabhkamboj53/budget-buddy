import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Expense } from '../../utils/types';

interface ExpenseState {
  expenses: Expense[];
  totalExpense: number;
}

const initialState: ExpenseState = {
  expenses: [],
  totalExpense: 0
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Expense>) => {
      const id = state.expenses.length + 1
      state.expenses.push({...action.payload, id: `${id}`});
      state.totalExpense += action.payload.amount;
    },
    updateExpense: (state, action: PayloadAction<{ id: string; updates: Partial<Expense> }>) => {
      const { id, updates } = action.payload;
      const expenseIndex = state.expenses.findIndex(exp => exp.id === id);
      if (expenseIndex !== -1) {
        state.expenses[expenseIndex] = {
          ...state.expenses[expenseIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      state.totalExpense = state.expenses.reduce((acc, exp) => acc + exp.amount, 0);
    },
    removeExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter(exp => exp.id !== action.payload);
      state.totalExpense = state.expenses.reduce((acc, exp) => acc + exp.amount, 0);
    },
    clearExpense: (state) => {
      state.expenses = initialState.expenses
      state.totalExpense = initialState.totalExpense
    },
  }
});

export const { addExpense, updateExpense, removeExpense } = expenseSlice.actions;
export default expenseSlice.reducer;
