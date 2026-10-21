
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uploadReport } from "./thunkApi";

export interface ReportItem {
    _id: string;
    title: string;
    headers: string[];
    data: Record<string, string>[];
    createdAt: string;
    updatedAt: string;
}

export interface ReportResponse {
    status: string;
    code: number;
    message: string;
    data: {
        totalRecords: number;
        reportList: ReportItem[];
    };
}

interface ReportState {
    data: ReportResponse["data"] | null;
    loading: boolean;
    error: string | null;
    success: string | null;
}

const initialState: ReportState = {
    data: null,
    loading: false,
    error: null,
    success: null,
};

const reportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {
        clearReportState: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
            state.success = null;
        },

        clearReportError: (state) => {
            state.error = null;
        },

        clearReportSuccess: (state) => {
            state.success = null;
        },

        setReportData: (
            state,
            action: PayloadAction<ReportResponse["data"]>
        ) => {
            state.data = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(uploadReport.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })

            .addCase(uploadReport.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.data = action.payload.data;
                state.success =
                    action.payload.message ||
                    "Report uploaded successfully";
            })

            .addCase(uploadReport.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ||
                    action.error.message ||
                    "Something went wrong";
            });
    },
});

export const {
    clearReportState,
    clearReportError,
    clearReportSuccess,
    setReportData,
} = reportSlice.actions;

export default reportSlice.reducer;
