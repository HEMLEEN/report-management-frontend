import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/auth/loginSlice";
import selectionReducer from "./features/selectionSlice";
import reportModeReducer from "./slices/setup/reportModeSlice";
import categoryReducer from "./slices/setup/categorySlice";

export const store = configureStore({
  reducer: {
    auth: loginReducer,
    selection: selectionReducer,
    reportMode: reportModeReducer,
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
