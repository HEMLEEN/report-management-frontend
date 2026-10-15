import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";
import authReducer from "./features/authSlice";
import selectionReducer from "./features/selectionSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    selection: selectionReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (gDM) => gDM().concat(api.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
