import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createCategory,
  createReportMode,
  listCategory,
  listReportMode,
} from "./thunkApi";

export interface CategoryItem {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryResponse {
  status: string;
  code: number;
  message: string;
  data: CategoryItem[];
}

interface CategoryState {
  listOfCategories: CategoryItem[];
  isCategoryLoading: {
    create: boolean;
    list: boolean;
  };
  message: string;
  categoryError: string | null;
}

const initialState: CategoryState = {
  listOfCategories: [],
  isCategoryLoading: {
    create: false,
    list: false,
  },
  message: "",
  categoryError: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    // Handle the async thunk actions for getDashboardStats
    builder

      // Create report mode stats
      .addCase(createCategory.pending, (state) => {
        state.isCategoryLoading.create = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isCategoryLoading.create = false;
        state.message = action.payload;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isCategoryLoading.create = false;
        state.categoryError = action.payload as string;
      })

      // List report mode stats
      .addCase(listCategory.pending, (state) => {
        state.isCategoryLoading.list = true;
        state.categoryError = null;
      })
      .addCase(listCategory.fulfilled, (state, action) => {
        state.isCategoryLoading.list = false;

        const response = action.payload as CategoryResponse;

        state.listOfCategories = response.data;
        state.message = response.message;
      })
      .addCase(listCategory.rejected, (state, action) => {
        state.isCategoryLoading.list = false;
        state.categoryError = action.payload as string;
      });
  },
});

export default categorySlice.reducer;
