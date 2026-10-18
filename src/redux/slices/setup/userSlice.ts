import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { approveUser, listUser } from "./thunkApi";

export interface UserItem {
  _id: string;
  name: string;
  userCode: string;
  status: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

interface UserResponse {
  status: string;
  code: number;
  message: string;
  data: UserItem[];
}

interface UserState {
  listOfUsers: UserItem[];
  isUserLoading: {
    create: boolean;
    list: boolean;
    approve: boolean;
  };
  message: string;
  userError: string | null;
}

const initialState: UserState = {
  listOfUsers: [],
  isUserLoading: {
    create: false,
    list: false,
    approve: false
  },
  message: "",
  userError: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    // Handle the async thunk actions for getDashboardStats
    builder

      // List report mode stats
      .addCase(listUser.pending, (state) => {
        state.isUserLoading.list = true;
        state.userError = null;
      })
      .addCase(listUser.fulfilled, (state, action) => {
        state.isUserLoading.list = false;
        const response = action.payload as UserResponse;
        state.listOfUsers = response.data;
        state.message = response.message;
      })
      .addCase(listUser.rejected, (state, action) => {
        state.isUserLoading.list = false;
        state.userError = action.payload as string;
      })

      .addCase(approveUser.pending, (state) => {
        state.isUserLoading.approve = true;
        state.userError = null;
      })
      .addCase(approveUser.fulfilled, (state, action) => {
        state.isUserLoading.approve = false;
        state.message = action.payload;
      })
      .addCase(approveUser.rejected, (state, action) => {
        state.isUserLoading.approve = false;
        state.userError = action.payload as string;
      });
  },
});

export default userSlice.reducer;
