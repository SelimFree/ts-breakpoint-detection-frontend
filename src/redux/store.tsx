import { configureStore } from "@reduxjs/toolkit";
import apiReducer from "./slices/apiSlice";
import globalReducer from "./slices/globalSlice";

export const store = configureStore({
  reducer: {
    api: apiReducer,
    global: globalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
