import { createAsyncThunk } from "@reduxjs/toolkit";
import { byUserCodeApi, createWorkspaceApi, listWorkspaceApi } from "./apiCalls";

export const createWorkspace = createAsyncThunk(
    "form/createWorkspace",
    async (body: any, thunkAPI) => {
        try {
            const response = await createWorkspaceApi(body);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Something went wrong",
            );
        }
    },
)

export const listWorkspace = createAsyncThunk(
    "form/listWorkspace",
    async (body: any, thunkAPI) => {
        try {
            const response = await listWorkspaceApi(body);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Something went wrong",
            );
        }
    },
)

export const byUserCodeWorkspace = createAsyncThunk(
    "form/byUserCodeWorkspace",
    async ({ userCode }: { userCode: string }, thunkAPI) => {
        try {
            const response = await byUserCodeApi({ userCode });
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Something went wrong",
            );
        }
    },
)