import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchVehicleByVin = createAsyncThunk(
  'vehicles/fetchByVin',
  async ({vin, userId}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
      return {
        ...parseVehicleData(response.data.Results, vin),
        userId: userId
      };
    } catch (error) {
      return rejectWithValue('Erreur lors de la récupération des données du véhicule');
    }
  }
);

export const fetchVehicleByDetails = createAsyncThunk(
  'vehicles/fetchByDetails',
  async ({ make, year, modelName, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`);
      
      if (response.data.Results.length > 0) {
        const sortedModels = response.data.Results.sort((a, b) => 
          a.Model_Name.localeCompare(b.Model_Name)
        );

        if (!modelName) {
          return sortedModels.map(model => ({
            id: model.Model_ID,
            model: model.Model_Name,
            make: model.Make_Name
          }));
        }

        const foundModel = sortedModels.find(model => 
          model.Model_Name.toLowerCase() === modelName.toLowerCase()
        );

        if (foundModel) {
          return {
            make: foundModel.Make_Name,
            model: foundModel.Model_Name,
            year: year,
            id: foundModel.Model_ID,
            style: 'N/A',
            engine: 'N/A',
            countryOfAssembly: 'N/A',
            userId: userId
          };
        } else {
          return rejectWithValue(`Le modèle '${modelName}' n'a pas été trouvé pour le constructeur '${make}' et l'année '${year}'`);
        }
      } else {
        return rejectWithValue(`Aucun modèle trouvé pour le constructeur '${make}' et l'année '${year}'`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMakes = createAsyncThunk(
  'vehicles/fetchMakes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json');
      return response.data.Results.map(make => make.Make_Name);
    } catch (error) {
      return rejectWithValue('Error fetching makes');
    }
  }
);

export const fetchModelsForMakeYear = createAsyncThunk(
  'vehicles/fetchModelsForMakeYear',
  async ({ make, year }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`);
      return response.data.Results.map(model => model.Model_Name);
    } catch (error) {
      return rejectWithValue('Error fetching models');
    }
  }
);

const parseVehicleData = (results, vin = '') => {
  return {
    vin: vin || results.find(item => item.Variable === "VIN")?.Value || 'Not provided',
    make: results.find(item => item.Variable === "Make")?.Value,
    model: results.find(item => item.Variable === "Model")?.Value,
    year: results.find(item => item.Variable === "Model Year")?.Value,
    style: results.find(item => item.Variable === "Body Class")?.Value,
    engine: `${results.find(item => item.Variable === "Engine Model")?.Value || ''} ${results.find(item => item.Variable === "Displacement (L)")?.Value || ''}L ${results.find(item => item.Variable === "Engine Configuration")?.Value || ''} ${results.find(item => item.Variable === "Engine Number of Cylinders")?.Value || ''} ${results.find(item => item.Variable === "Fuel Type - Primary")?.Value || ''}`.trim(),
    countryOfAssembly: results.find(item => item.Variable === "Plant Country")?.Value,
    repairHistory: []
  };
};

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState: {
    vehicles: [],
    makes: [],
    models: [],
    loading: false,
    error: null
  },
  reducers: {
    addVehicle: (state, action) => {
      state.vehicles.push({
        ...action.payload,
        id: Date.now(),
        repairHistory: [],
        userId: action.payload.userId
      });
    },
    updateVehicle: (state, action) => {
      const index = state.vehicles.findIndex(vehicle => vehicle.id === action.payload.id);
      if (index !== -1) {
        state.vehicles[index] = {...state.vehicles[index], ...action.payload};
      }
    },
    deleteVehicle: (state, action) => {
      state.vehicles = state.vehicles.filter(vehicle => vehicle.id !== action.payload);
    },
    addRepair: (state, action) => {
      const { vehicleId, repair } = action.payload;
      const vehicle = state.vehicles.find(v => v.id === vehicleId);
      if (vehicle) {
        vehicle.repairHistory.push({...repair, id: Date.now()});
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicleByVin.fulfilled, (state, action) => {
        state.vehicles.push({...action.payload, id: Date.now()});
      })
      .addCase(fetchVehicleByDetails.fulfilled, (state, action) => {
        if (!Array.isArray(action.payload) && action.payload.make) {
          state.vehicles.push({...action.payload, id: Date.now(), repairHistory: []});
        }
      })
      .addCase(fetchMakes.fulfilled, (state, action) => {
        state.makes = action.payload;
        state.loading = false;
      })
      .addCase(fetchMakes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMakes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchModelsForMakeYear.fulfilled, (state, action) => {
        state.models = action.payload;
        state.loading = false;
      })
      .addCase(fetchModelsForMakeYear.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchModelsForMakeYear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addVehicle, updateVehicle, deleteVehicle, addRepair } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
