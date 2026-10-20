import { createSlice } from "@reduxjs/toolkit";
import {
    byUserCodeWorkspace,
    createWorkspace,
    listWorkspace,
} from "./thunkApi";

export interface WorspaceItem {
    _id: string;
    source: string;
    category: string;
    segment: string;
    createdAt: string;
    updatedAt: string;
}

interface WorkspaceResponse {
    status: string;
    code: number;
    message: string;
    data: WorspaceItem;
}

export interface Identity {
    _id: string;
    name: string;
}

export interface WorkspaceListItem {
    _id: string;
    user: {
        userCode: string;
        name: string;
    };
    reportMode: Identity;
    category: Identity;
    company: Identity;
    segment: string;
    createdAt: string;
    updatedAt: string;
}

interface WorkspaceListResponse {
    status: string;
    code: number;
    message: string;
    data: {
        workspaceList: WorkspaceListItem[];
        totalRecords: number;
    };
}

interface WorkspaceUserResponse {
    status: string;
    code: number;
    message: string;
    data: {
        workspaceList: WorkspaceListItem[];
        totalRecords: number;
    };
}

interface WorkspaceState {
    workspaceDetails: WorspaceItem | null;
    listofWorkspace: WorkspaceListItem[];
    byUserCode: WorkspaceListItem[];
    totalRecords: number;
    totalUserRecords: number;
    isWorkspaceLoading: {
        create: boolean;
        list: boolean;
        byUserCode: boolean;
    };
    message: string;
    workspaceError: string | null;
}

const initialState: WorkspaceState = {
    workspaceDetails: null,
    listofWorkspace: [],
    byUserCode: [],
    totalRecords: 0,
    totalUserRecords: 0,
    isWorkspaceLoading: {
        create: false,
        list: false,
        byUserCode: false,
    },
    message: "",
    workspaceError: null,
};

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            // Create workspace
            .addCase(createWorkspace.pending, (state) => {
                state.isWorkspaceLoading.create = true;
                state.workspaceError = null;
            })
            .addCase(createWorkspace.fulfilled, (state, action) => {
                state.isWorkspaceLoading.create = false;

                const response = action.payload as WorkspaceResponse;

                state.workspaceDetails = response.data;
                state.message = response.message;
            })
            .addCase(createWorkspace.rejected, (state, action) => {
                state.isWorkspaceLoading.create = false;
                state.workspaceError =
                    (action.payload as string) ||
                    action.error.message ||
                    "Failed to create workspace.";
            })

            // List all workspaces
            .addCase(listWorkspace.pending, (state) => {
                state.isWorkspaceLoading.list = true;
                state.workspaceError = null;
            })
            .addCase(listWorkspace.fulfilled, (state, action) => {
                state.isWorkspaceLoading.list = false;

                const response = action.payload as WorkspaceListResponse;

                state.listofWorkspace = Array.isArray(
                    response?.data?.workspaceList,
                )
                    ? response.data.workspaceList
                    : [];

                state.totalRecords =
                    response?.data?.totalRecords ?? 0;

                state.message = response?.message ?? "";
            })
            .addCase(listWorkspace.rejected, (state, action) => {
                state.isWorkspaceLoading.list = false;
                state.workspaceError =
                    (action.payload as string) ||
                    action.error.message ||
                    "Failed to load workspaces.";
            })

            // Workspaces for a specific user
            .addCase(byUserCodeWorkspace.pending, (state) => {
                state.isWorkspaceLoading.byUserCode = true;
                state.workspaceError = null;
            })
            .addCase(byUserCodeWorkspace.fulfilled, (state, action) => {
                state.isWorkspaceLoading.byUserCode = false;

                const response =
                    action.payload as WorkspaceUserResponse;

                state.byUserCode = Array.isArray(
                    response?.data?.workspaceList,
                )
                    ? response.data.workspaceList
                    : [];

                state.totalUserRecords =
                    response?.data?.totalRecords ?? 0;

                state.message = response?.message ?? "";
            })
            .addCase(byUserCodeWorkspace.rejected, (state, action) => {
                state.isWorkspaceLoading.byUserCode = false;
                state.workspaceError =
                    (action.payload as string) ||
                    action.error.message ||
                    "Failed to load user workspaces.";
            });
    },
});

export default workspaceSlice.reducer;