import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (userData, { rejectWithValue }) => {
    try {
      await delay(1000);
      return { ...userData, id: Date.now() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    error: null,
    isLoading: false,
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    addPaymentMethod: (state, action) => {
      if (!state.user.paymentMethods) {
        state.user.paymentMethods = [];
      }
      state.user.paymentMethods.push(action.payload);
    },
    removePaymentMethod: (state, action) => {
      state.user.paymentMethods = state.user.paymentMethods.filter(
        method => method.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { login, logout, updateUser, addPaymentMethod, removePaymentMethod } = authSlice.actions;
export default authSlice.reducer;
