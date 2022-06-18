/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const setLocations = createAsyncThunk('locations/setLocations', async () => {
  const response = await axios.get('https://api.triip.me/api/v1/places');
  const data = await response.data;
  return {
    destinations: data.map(item => item.name)
  };
});

const initialState = {
  destinations: []
};

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {},
  extraReducers: {
    [setLocations.fulfilled]: (_state, action) => action.payload,
  },
});

export const getDestinations = ({ locations }) => locations.destinations;

export default locationsSlice.reducer;
