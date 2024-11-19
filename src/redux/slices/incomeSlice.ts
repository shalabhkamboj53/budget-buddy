import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Income } from '../../utils/types';

interface IncomeState {
  incomes: Income[];
  totalIncome: number;
}

const initialState: IncomeState = {
  incomes: [],
  totalIncome: 0
};

const incomeSlice = createSlice({
  name: 'income',
  initialState,
  reducers: {
    addIncome: (state, action: PayloadAction<Income>) => {
      const id = state.incomes.length + 1
      state.incomes.push({...action.payload, id: `${id}`});
      state.totalIncome += action.payload.amount;
    },
    updateIncome: (state, action: PayloadAction<{ id: string; updates: Partial<Income> }>) => {
      const { id, updates } = action.payload;
      const incomeIndex = state.incomes.findIndex(income => income.id === id);
      if (incomeIndex !== -1) {
        state.incomes[incomeIndex] = {
          ...state.incomes[incomeIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      state.totalIncome = state.incomes.reduce((acc, income) => acc + income.amount, 0);
    },
    removeIncome: (state, action: PayloadAction<string>) => {
      state.incomes = state.incomes.filter(income => income.id !== action.payload);
      state.totalIncome = state.incomes.reduce((acc, income) => acc + income.amount, 0);
    }
  }
});

export const { addIncome, updateIncome, removeIncome } = incomeSlice.actions;
export default incomeSlice.reducer;
