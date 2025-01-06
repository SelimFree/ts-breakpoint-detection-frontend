import { createSlice } from "@reduxjs/toolkit";

interface GlobalState {
  map: {
    hideLegends: boolean;
    selectedPoints: Array<number>;
  }
}

const initialState: GlobalState = {
  map: {
    hideLegends: false,
    selectedPoints: [],
  }
};


export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMapParams: (state, action) => {
      state.map = { ...state.map, ...action.payload };
    }
  },
});

export const { setMapParams } = globalSlice.actions;

export default globalSlice.reducer;
