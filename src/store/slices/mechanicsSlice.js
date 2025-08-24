import { createSlice } from '@reduxjs/toolkit';

const mechanicsSlice = createSlice({
  name: 'mechanics',
  initialState: [
    { id: 2, name: 'Jane Smith', speciality: 'Specialiste en moteur', email: 'jane.smith@example.com' },
    { id: 6, name: 'Michael Davis', speciality: 'Expert en transmission', email: 'michael.davis@example.com' },
    { id: 8, name: 'David Taylor', speciality: 'Spécialiste en systèmes électriques', email: 'david.taylor@example.com' },
  ],
  reducers: {
  }
});

export default mechanicsSlice.reducer;
