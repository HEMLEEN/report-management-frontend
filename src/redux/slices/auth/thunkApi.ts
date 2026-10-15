import { createAsyncThunk } from "@reduxjs/toolkit";
import { createAuthenticateApi, createLoginApi } from "./apiCalls";

export const creatLogin = createAsyncThunk(
  "form/createLogin",
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await createLoginApi(formData);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const creatAuthenticate = createAsyncThunk(
  "form/createAuthenticate",
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await createAuthenticateApi(formData);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
