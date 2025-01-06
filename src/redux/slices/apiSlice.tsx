import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ApiState {
    [key: string]: any;
}

const initialState: ApiState = {};

export const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    getApiSuccess: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const { getApiSuccess } = apiSlice.actions;

export default apiSlice.reducer;
