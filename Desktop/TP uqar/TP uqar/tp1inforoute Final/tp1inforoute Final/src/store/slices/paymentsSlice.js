import { createSlice } from '@reduxjs/toolkit';

const paymentsSlice = createSlice({
  name: 'payments',
  initialState: [],
  reducers: {
    addPayment: (state, action) => {
      state.push({ ...action.payload, id: Date.now(), status: 'completed' });
    },
    updatePayment: (state, action) => {
      const index = state.findIndex(payment => payment.id === action.payload.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
  }
});

export const { addPayment, updatePayment } = paymentsSlice.actions;
export default paymentsSlice.reducer;