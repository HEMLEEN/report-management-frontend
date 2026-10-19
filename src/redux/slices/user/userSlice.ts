
import { createSlice } from "@reduxjs/toolkit";
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
  data: {
    userList: UserItem[];
    totalRecords: number;
  };
}

interface UserState {
  listOfUsers: UserItem[];
  totalUserRecords: number;
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
  totalUserRecords: 0,
  isUserLoading: {
    create: false,
    list: false,
    approve: false,
  },
  message: "",
  userError: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // List users
      .addCase(listUser.pending, (state) => {
        state.isUserLoading.list = true;
        state.userError = null;
      })
      .addCase(listUser.fulfilled, (state, action) => {
        state.isUserLoading.list = false;

        const response = action.payload as UserResponse;

        state.listOfUsers = response.data.userList;
        state.totalUserRecords =
          response.data.totalRecords;
        state.message = response.message;
      })
      .addCase(listUser.rejected, (state, action) => {
        state.isUserLoading.list = false;
        state.userError =
          (action.payload as string) ||
          action.error.message ||
          "Failed to load users.";
      })

      // Approve / deactivate user
      .addCase(approveUser.pending, (state) => {
        state.isUserLoading.approve = true;
        state.userError = null;
      })
      .addCase(approveUser.fulfilled, (state, action) => {
        state.isUserLoading.approve = false;
        state.message =
          typeof action.payload === "string"
            ? action.payload
            : "User status updated successfully.";
      })
      .addCase(approveUser.rejected, (state, action) => {
        state.isUserLoading.approve = false;
        state.userError =
          (action.payload as string) ||
          action.error.message ||
          "Failed to update user status.";
      });
  },
});

export default userSlice.reducer;