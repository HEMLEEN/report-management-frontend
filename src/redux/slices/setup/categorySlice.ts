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
  list: CategoryItem[];
  loading: {
    create: boolean;
    list: boolean;
  };
  message: string;
  error: string | null;
}

const initialState: CategoryState = {
  list: [],
  loading: {
    create: false,
    list: false,
  },
  message: "",
  error: null,
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
        state.loading.create = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading.create = false;
        state.message = action.payload;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload as string;
      })

      // List report mode stats
      .addCase(listCategory.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(listCategory.fulfilled, (state, action) => {
        state.loading.list = false;

        const response = action.payload as CategoryResponse;

        state.list = response.data;
        state.message = response.message;
      })
      .addCase(listCategory.rejected, (state, action) => {
        state.loading.list = false;
        state.error = action.payload as string;
      });
  },
});

export default categorySlice.reducer;
