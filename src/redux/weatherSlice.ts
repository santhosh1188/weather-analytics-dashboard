import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWeather } from '../services/weatherApi';
import { WeatherData } from '../types';

interface WeatherState {
  data: { [city: string]: WeatherData };
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  data: {},
  loading: false,
  error: null,
};

export const getWeather = createAsyncThunk(
  'weather/getWeather',
  async (city: string, { rejectWithValue }) => {
    try {
      return await fetchWeather(city);
    } catch (error) {
      return rejectWithValue('Failed to load weather');
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWeather.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWeather.fulfilled, (state, action) => {
        state.loading = false;
        const city = action.meta.arg!;
        state.data[city] = action.payload;
      })
      .addCase(getWeather.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load weather';
      });
  },
});

export default weatherSlice.reducer;