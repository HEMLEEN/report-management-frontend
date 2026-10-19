import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createReportModeApi,
  createCategoryApi,
  createCompanyApi,
  listReportModeApi,
  assignCompanyApi,
  assignCategoryApi,
  listCategoryApi,
  listCompanyApi
} from "./apiCalls";

export const createReportMode = createAsyncThunk(
  "form/createReportMode",
  async ({ name }: { name: string }, thunkAPI) => {
    try {
      const response = await createReportModeApi({ name });
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const listReportMode = createAsyncThunk(
  "form/listReportMode",
  async (body: any, thunkAPI) => {
    try {
      const response = await listReportModeApi(body);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const assignCategory = createAsyncThunk(
  "form/assignCategory",
  async (body: any, thunkAPI) => {
    try {
      const response = await assignCategoryApi(body);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const assignCompany = createAsyncThunk(
  "form/assignCompany",
  async (body: any, thunkAPI) => {
    try {
      const response = await assignCompanyApi(body);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const createCategory = createAsyncThunk(
  "form/createCategory",
  async ({ name }: { name: string }, thunkAPI) => {
    try {
      const response = await createCategoryApi({ name });
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const listCategory = createAsyncThunk(
  "form/listCategory",
  async (body: any, thunkAPI) => {
    try {
      const response = await listCategoryApi(body);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const createCompany = createAsyncThunk(
  "form/createCompany",
  async ({ name }: { name: string }, thunkAPI) => {
    try {
      const response = await createCompanyApi({ name });
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const listCompany = createAsyncThunk(
  "form/listCompany",
  async (body: any, thunkAPI) => {
    try {
      const response = await listCompanyApi(body);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
