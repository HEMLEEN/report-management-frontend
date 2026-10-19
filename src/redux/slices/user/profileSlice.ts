
import { createSlice } from "@reduxjs/toolkit";
import { profileUser } from "./thunkApi";

export interface ProfileItem {
    _id: string;
    name: string;
    userCode: string;
    status: string;
    roles: string[];
    createdAt: string;
    updatedAt: string;
}

interface ProfileResponse {
    status: string;
    code: number;
    message: string;
    data: ProfileItem;
}

interface ProfileState {
    userDetails: ProfileItem | null;
    isUserLoading: {
        create: boolean;
        detail: boolean;
    };
    message: string;
    profileError: string | null;
}

const initialState: ProfileState = {
    userDetails: null,
    isUserLoading: {
        create: false,
        detail: false,
    },
    message: "",
    profileError: null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            // List users
            .addCase(profileUser.pending, (state) => {
                state.isUserLoading.detail = true;
                state.profileError = null;
            })
            .addCase(profileUser.fulfilled, (state, action) => {
                state.isUserLoading.detail = false;

                const response = action.payload as ProfileResponse;

                state.userDetails = response.data;
                state.message = response.message;
            })
            .addCase(profileUser.rejected, (state, action) => {
                state.isUserLoading.detail = false;
                state.profileError =
                    (action.payload as string) ||
                    action.error.message ||
                    "Failed to load users.";
            })
    },
});

export default profileSlice.reducer;