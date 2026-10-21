import { createAsyncThunk } from "@reduxjs/toolkit";
import { listReportExcelApi, uploadReportApi } from "./apiCalls";

export interface UploadReportBody {
    title:string;
    headers: string[];
    file: File;
}

export const uploadReport = createAsyncThunk(
    "report/uploadReport",
    async (body: UploadReportBody, thunkAPI) => {
        try {
            const response = await uploadReportApi(body);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    }
);


export const listReportBuilder= createAsyncThunk(
  "form/listReports",
  async (body: any, thunkAPI) => {
    try {
      const response = await listReportExcelApi(body);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
