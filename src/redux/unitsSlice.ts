import { createSlice } from '@reduxjs/toolkit';
import { Unit } from '../types';

interface UnitsState {
  unit: Unit;
}

const initialState: UnitsState = { unit: 'C' };

const unitsSlice = createSlice({
  name: 'units',
  initialState,
  reducers: {
    toggleUnit: (state) => {
      state.unit = state.unit === 'C' ? 'F' : 'C';
    },
  },
});

export const { toggleUnit } = unitsSlice.actions;
export default unitsSlice.reducer;