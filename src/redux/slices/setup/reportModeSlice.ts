import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createReportMode, listReportMode } from "./thunkApi";

export interface ReportModeItem {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  }[];
  company: {
    _id: string;
    name: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface ReportModeResponse {
  status: string;
  code: number;
  message: string;
  data: ReportModeItem[];
}

interface ReportModeState {
  list: ReportModeItem[];
  loading: {
    create: boolean;
    list: boolean;
  };
  message: string;
  error: string | null;
}

const initialState: ReportModeState = {
  list: [],
  loading: {
    create: false,
    list: false,
  },
  message: "",
  error: null,
};

const reportModeSlice = createSlice({
  name: "reportMode",
  initialState,
  reducers: {
   
  },

  extraReducers: (builder) => {
    // Handle the async thunk actions for getDashboardStats
    builder

      // Create report mode stats
      .addCase(createReportMode.pending, (state) => {
        state.loading.create = true;
      })
      .addCase(createReportMode.fulfilled, (state, action) => {
        state.loading.create = false;
        state.message = action.payload;
      })
      .addCase(createReportMode.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload as string;
      })

      // List report mode stats
      .addCase(listReportMode.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(listReportMode.fulfilled, (state, action) => {
        state.loading.list = false;

        const response = action.payload as ReportModeResponse;

        state.list = response.data;
        state.message = response.message;
      })
      .addCase(listReportMode.rejected, (state, action) => {
        state.loading.list = false;
        state.error = action.payload as string;
      });

  },
});

export default reportModeSlice.reducer;
