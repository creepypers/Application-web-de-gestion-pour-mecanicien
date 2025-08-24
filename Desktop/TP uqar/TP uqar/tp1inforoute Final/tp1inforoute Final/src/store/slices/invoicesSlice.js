import { createSlice } from '@reduxjs/toolkit';

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState: [],
  reducers: {
    addInvoice: (state, action) => {
      state.push({ 
        ...action.payload, 
        id: Date.now(), 
        status: 'paid',
        amount: Number(action.payload.amount),
        userId: action.payload.userId
      });
    },
    updateInvoice: (state, action) => {
      const index = state.findIndex(invoice => invoice.id === action.payload.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
    payInvoice: (state, action) => {
      const invoice = state.find(inv => inv.id === action.payload);
      if (invoice) {
        invoice.status = 'paid';
      }
    },
    deleteInvoice: (state, action) => {
      return state.filter(invoice => invoice.id !== action.payload);
    }
  }
});

export const { addInvoice, updateInvoice, payInvoice, deleteInvoice } = invoicesSlice.actions;
export default invoicesSlice.reducer;
