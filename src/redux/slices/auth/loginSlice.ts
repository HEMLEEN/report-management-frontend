
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

const getStoredLogin = (): LoginResponse | null => {
  try {
    const storedLogin = localStorage.getItem("login");
    return storedLogin ? JSON.parse(storedLogin) as LoginResponse : null;
  } catch {
    return null;
  }
};

const initialState: LoginState = {
  loading: {
    create: false,
    authenticate: false,
  },
  login: getStoredLogin(),
  error: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoading: (
      state,
      action: PayloadAction<{
        type: "create" | "authenticate";
        value: boolean;
      }>
    ) => {
      state.loading[action.payload.type] = action.payload.value;
    },

    setLogin: (
      state,
      action: PayloadAction<LoginResponse | null>
    ) => {
      state.login = action.payload;
    },

    setError: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.error = action.payload;
    },

    logout: (state) => {
      state.login = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(creatLogin.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(creatLogin.fulfilled, (state, action) => {
        state.loading.create = false;
        state.login = action.payload;
      })
      .addCase(creatLogin.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload as string;
      })

      .addCase(creatAuthenticate.pending, (state) => {
        state.loading.authenticate = true;
        state.error = null;
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

export const { logout, setLogin, setLoading, setError } =
  loginSlice.actions;

export default loginSlice.reducer;
