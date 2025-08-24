import { createSlice } from '@reduxjs/toolkit';

const earningsSlice = createSlice({
  name: 'earnings',
  initialState: [],
  reducers: {
    addEarning: (state, action) => {
      state.push({
        id: Date.now(),
        mechanicId: action.payload.mechanicId,
        amount: action.payload.amount,
        date: action.payload.date,
        appointmentId: action.payload.appointmentId,
        serviceDescription: action.payload.serviceDescription
      });
    },
  }
});

export const { addEarning } = earningsSlice.actions;
export default earningsSlice.reducer; 