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
  data: {
    reportModeList: ReportModeItem[];
    totalRecords: number;
  };
}

interface ReportModeState {
  listOfReportMode: ReportModeItem[];
  totalReportRecords: number;
  isReportModeLoading: {
    create: boolean;
    list: boolean;
    isLoading: boolean;
    isDisabled: boolean;
  };
  message: string;
  reportModeError: string | null;
}

const initialState: ReportModeState = {
  listOfReportMode: [],
  totalReportRecords: 0,
  isReportModeLoading: {
    create: false,
    list: false,
    isLoading: false,
    isDisabled: false,
  },
  message: "",
  reportModeError: null,
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
        state.isReportModeLoading.create = true;
      })
      .addCase(createReportMode.fulfilled, (state, action) => {
        state.isReportModeLoading.create = false;
        state.message = action.payload;
      })
      .addCase(createReportMode.rejected, (state, action) => {
        state.isReportModeLoading.create = false;
        state.reportModeError = action.payload as string;
      })

      // List report mode stats
      .addCase(listReportMode.pending, (state) => {
        state.isReportModeLoading.list = true;
        state.reportModeError = null;
      })
      .addCase(listReportMode.fulfilled, (state, action) => {
        state.isReportModeLoading.list = false;

        const response = action.payload as ReportModeResponse;

        state.listOfReportMode = response.data.reportModeList;
        state.totalReportRecords =
          response.data.totalRecords;
        state.message = response.message;
      })
      .addCase(listReportMode.rejected, (state, action) => {
        state.isReportModeLoading.list = false;
        state.reportModeError = action.payload as string;
      });

  },
});

export default reportModeSlice.reducer;
