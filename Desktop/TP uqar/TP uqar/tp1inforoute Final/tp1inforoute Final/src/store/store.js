import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vehiclesReducer from './slices/vehiclesSlice';
import invoicesReducer from './slices/invoicesSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import mechanicsReducer from './slices/mechanicsSlice';
import paymentsReducer from './slices/paymentsSlice';
import earningsReducer from './slices/earningsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehiclesReducer,
    invoices: invoicesReducer,
    appointments: appointmentsReducer,
    mechanics: mechanicsReducer,
    payments: paymentsReducer,
    earnings: earningsReducer,
  },
});

export default store;