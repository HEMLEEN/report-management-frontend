import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/auth/loginSlice";
import selectionReducer from "./features/selectionSlice";
import reportModeReducer from "./slices/setup/reportModeSlice";
import categoryReducer from "./slices/setup/categorySlice";
import companyReducer from "./slices/setup/companySlice"
import userReducer from "./slices/setup/userSlice"

export const store = configureStore({
  reducer: {
    auth: loginReducer,
    selection: selectionReducer,
    reportMode: reportModeReducer,
    category: categoryReducer,
    company: companyReducer,
    user: userReducer,
  },
});

store.subscribe(() => {
  const login = store.getState().auth.login;

  if (login) {
    localStorage.setItem("login", JSON.stringify(login));
  } else {
    localStorage.removeItem("login");
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
