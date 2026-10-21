import { createAsyncThunk } from "@reduxjs/toolkit";
import { approveUserApi, assignRoleApi, listUserApi, userDetailsApi } from "./apiCalls";

export const profileUser = createAsyncThunk(
    "form/profileUser",
    async ({ userCode }: { userCode: string }, thunkAPI) => {
        try {
            const response = await userDetailsApi({ userCode });
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Something went wrong",
            );
        }
    },
)


export const listUser = createAsyncThunk(
    "form/listUser",
    async (body: any, thunkAPI) => {
        try {
            const response = await listUserApi(body);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Something went wrong",
            );
        }
    },
)

export const assignRole = createAsyncThunk(
    "form/assignRole",
    async (body: any, thunkAPI) => {
        try {
            const response = await assignRoleApi(body);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Something went wrong",
            );
        }
    })

export const approveUser = createAsyncThunk(
    "form/approveUSer",
    async (body: any, thunkAPI) => {
        try {
            const response = await approveUserApi(body);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Something went wrong",
            );
        }
    })