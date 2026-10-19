import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createCategory,
  createCompany,
  createReportMode,
  listCategory,
  listCompany,
  listReportMode,
} from "./thunkApi";

export interface CompanyItem {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CompanyResponse {
  status: string;
  code: number;
  message: string;
  data: {
    companyList: CompanyItem[];
    totalRecords: number;
  };
}

interface CompanyState {
  listOfCompanies: CompanyItem[];
  totalRecords: number;
  isCompanyLoading: {
    create: boolean;
    list: boolean;
  };
  message: string;
  companyError: string | null;
}

const initialState: CompanyState = {
  listOfCompanies: [],
  totalRecords: 0,
  isCompanyLoading: {
    create: false,
    list: false,
  },
  message: "",
  companyError: null,
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    // Handle the async thunk actions for getDashboardStats
    builder

      // Create report mode stats
      .addCase(createCompany.pending, (state) => {
        state.isCompanyLoading.create = true;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.isCompanyLoading.create = false;
        state.message = action.payload;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.isCompanyLoading.create = false;
        state.companyError = action.payload as string;
      })

      // List report mode stats
      .addCase(listCompany.pending, (state) => {
        state.isCompanyLoading.list = true;
        state.companyError = null;
      })
      .addCase(listCompany.fulfilled, (state, action) => {
        state.isCompanyLoading.list = false;
        const response = action.payload as CompanyResponse;
        state.listOfCompanies = response.data.companyList;
        state.totalRecords =
          response.data.totalRecords;
        state.message = response.message;
      })
      .addCase(listCompany.rejected, (state, action) => {
        state.isCompanyLoading.list = false;
        state.companyError = action.payload as string;
      });
  },
});

export default companySlice.reducer;
