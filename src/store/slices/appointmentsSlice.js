import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addRepair } from './vehiclesSlice';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const bookAppointment = createAsyncThunk(
  'appointments/bookAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      await delay(1000); 
      return { 
        ...appointmentData, 
        id: Date.now(), 
        status: 'pending',
        date: appointmentData.date || 'Not set',
        timeSlot: appointmentData.timeSlot || 'Not set',
        mechanicInfo: appointmentData.mechanicInfo || null
      };
    } catch (error) {
      return rejectWithValue('Echec de la réservation du rendez-vous. Veuillez réessayer.');
    }
  }
);

export const updateAppointment = createAsyncThunk(
  'appointments/updateAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      await delay(1000); 
      return { ...appointmentData, status: 'modification_pending' };
    } catch (error) {
      return rejectWithValue('Echec de la mise à jour du rendez-vous. Veuillez réessayer.');
    }
  }
);

export const completeAppointment = createAsyncThunk(
  'appointments/completeAppointment',
  async (appointmentData, { dispatch }) => {
    await delay(1000);
    
    dispatch(addRepair({
      vehicleId: appointmentData.vehicleInfo.id,
      repair: {
        date: new Date().toISOString(),
        description: appointmentData.service,
        cost: appointmentData.estimatedCost
      }
    }));

    return { ...appointmentData, status: 'completed' };
  }
);

export const requestModification = createAsyncThunk(
  'appointments/requestModification',
  async (appointmentData, { rejectWithValue }) => {
    try {
      await delay(1000); 
      return { ...appointmentData, status: 'modification_requested' };
    } catch (error) {
      return rejectWithValue('Echec de la demande de modification. Veuillez réessayer.');
    }
  }
);

const initialState = {
  appointments: [],
  status: 'idle',
  error: null
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    cancelAppointment: (state, action) => {
      const appointment = state.appointments.find(app => app.id === action.payload);
      if (appointment) {
        appointment.status = 'cancelled';
      }
    },
    confirmAppointment: (state, action) => {
      const appointment = state.appointments.find(app => app.id === action.payload.id);
      if (appointment) {
        appointment.status = 'confirmed';
        appointment.estimatedDuration = action.payload.estimatedDuration;
        appointment.estimatedCost = action.payload.estimatedCost;
      }
    },
    rejectAppointment: (state, action) => {
      const appointment = state.appointments.find(app => app.id === action.payload.id);
      if (appointment) {
        appointment.status = 'rejected';
        appointment.rejectionReason = action.payload.rejectionReason;
      }
    },
    approveModification: (state, action) => {
      const appointment = state.appointments.find(app => app.id === action.payload.id);
      if (appointment) {
        appointment.status = 'confirmed';
        Object.assign(appointment, action.payload.updatedData);
      }
    },
    rejectModification: (state, action) => {
      const appointment = state.appointments.find(app => app.id === action.payload.id);
      if (appointment) {
        appointment.status = 'rejected';
        appointment.rejectionReason = action.payload.rejectionReason;
      }
    },
    updatePaymentStatus: (state, action) => {
      const { appointmentId, isPaid } = action.payload;
      const appointment = state.appointments.find(app => app.id === appointmentId);
      if (appointment) {
        appointment.isPaid = isPaid;
      }
    },
    deleteAppointment: (state, action) => {
      state.appointments = state.appointments.filter(appointment => appointment.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.appointments.push({
          ...action.payload,
          userId: action.payload.userId,
          mechanicId: action.payload.mechanicId
        });
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      })
      .addCase(completeAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      })
      .addCase(requestModification.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      });
  }
});

export const { 
  cancelAppointment, 
  confirmAppointment, 
  rejectAppointment,
  approveModification,
  rejectModification,
  updatePaymentStatus,
  deleteAppointment
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
