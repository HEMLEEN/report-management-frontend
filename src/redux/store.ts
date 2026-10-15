import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/auth/loginSlice";
import selectionReducer from "./features/selectionSlice";

export const store = configureStore({
  reducer: {
    auth: loginReducer,
    selection: selectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
