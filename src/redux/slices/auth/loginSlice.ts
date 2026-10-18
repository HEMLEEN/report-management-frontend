import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { creatAuthenticate, creatLogin } from "./thunkApi";

export interface AuthUser {
  id: string;
  userCode: string;

}

export interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    roles: string[];
    user: AuthUser;
  };
}
export interface LoginState {
  loading: {
    create: boolean;
    authenticate: boolean;
  };
  login: LoginResponse | null;
  error: string | null;
}

const initialState: LoginState = {
  loading: {
    create: false,
    authenticate: false,
  },
  login: null,
  error: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoading: (
      state: { loading: { [x: string]: boolean } },
      action: PayloadAction<{
        type: "create" | "authenticate";
        value: boolean;
      }>,
    ) => {
      state.loading[action.payload.type] = action.payload.value;
    },
    setLogin: (
      state: { login: LoginResponse | null },
      action: PayloadAction<LoginResponse | null>,
    ) => {
      state.login = action.payload;
    },
    setError: (
      state: { error: string | null },
      action: PayloadAction<string | null>,
    ) => {
      state.error = action.payload;
    },
  },

  extraReducers: (builder) => {
    // Handle the async thunk actions for getDashboardStats
    builder

      // Create patient stats
      .addCase(creatLogin.pending, (state) => {
        state.loading.create = true;
      })
      .addCase(creatLogin.fulfilled, (state, action) => {
        state.loading.create = false;
        state.login = action.payload;
      })
      .addCase(creatLogin.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload as string;
      })

      // login stats
      .addCase(creatAuthenticate.pending, (state) => {
        state.loading.authenticate = true;
      })
      .addCase(creatAuthenticate.fulfilled, (state, action) => {
        state.loading.authenticate = false;
        state.login = action.payload;
      })
      .addCase(creatAuthenticate.rejected, (state, action) => {
        state.loading.authenticate = false;
        state.error = action.payload as string;
      });
  },
});

export default loginSlice.reducer;
