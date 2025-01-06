import { createSlice } from "@reduxjs/toolkit";

export const globalSlice = createSlice({
  name: "global",
  initialState: {
    map: {
      hideLegends: false
    }
  },
  reducers: {

    setMap: (state, action) => {
      state.map = { ...state.map, ...action.payload };
    }
  },
});

export const { setMap } = globalSlice.actions;

export default globalSlice.reducer;
