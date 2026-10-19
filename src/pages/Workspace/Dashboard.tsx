
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import Sidebar from "../../components/Sidebar";
import {
    Building2,
    CalendarDays,
    FileText,
    Layers3,
    RefreshCw,
    Users,
    AlertCircle,
} from "lucide-react";
import { listWorkspace } from "../../redux/slices/workspace/thunkApi";


const Dashboard = () => {
    const [mobile, setMobile] = useState(false);

    const dispatch = useDispatch<AppDispatch>();

    const {
        listofWorkspace,
        totalRecords,
        isWorkspaceLoading,
        workspaceError,
    } = useSelector((state: RootState) => state.workspace);

    // useEffect(() => {
    //     // dispatch(listWorkspace({ skip: 0, limit: 12, search: "" }));
    // }, [dispatch]);

    const formatDate = (date: string) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
            {/* Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        View and manage your workspaces.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        dispatch(
                            listWorkspace({
                                skip: 0,
                                limit: 12,
                                search: "",
                            }),
                        )
                    }
                    disabled={isWorkspaceLoading.list}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        size={16}
                        className={
                            isWorkspaceLoading.list ? "animate-spin" : ""
                        }
                    />
                    Refresh
                </button>
            </div>

            {/* Summary */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Total Workspaces
                            </p>
                            <h2 className="mt-2 text-3xl font-bold text-slate-800">
                                {totalRecords}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                            <Layers3 size={25} />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Loaded Workspaces
                            </p>
                            <h2 className="mt-2 text-3xl font-bold text-slate-800">
                                {listofWorkspace.length}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                            <FileText size={25} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Workspace heading */}
            <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-800">
                    My Workspaces
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Your available report workspaces.
                </p>
            </div>

            {/* Loading */}
            {isWorkspaceLoading.list && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse rounded-xl border border-slate-200 bg-white p-5"
                        >
                            <div className="mb-5 flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-slate-200" />
                                <div className="flex-1">
                                    <div className="mb-2 h-4 w-2/3 rounded bg-slate-200" />
                                    <div className="h-3 w-1/3 rounded bg-slate-100" />
                                </div>
                            </div>
                            <div className="mb-3 h-4 rounded bg-slate-100" />
                            <div className="mb-3 h-4 rounded bg-slate-100" />
                            <div className="h-4 w-2/3 rounded bg-slate-100" />
                        </div>
                    ))}
                </div>
            )}

            {/* Error */}
            {!isWorkspaceLoading.list && workspaceError && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                    <AlertCircle size={22} className="mt-0.5 shrink-0" />
                    <div>
                        <h3 className="font-semibold">
                            Failed to load workspaces
                        </h3>
                        <p className="mt-1 text-sm">{workspaceError}</p>
                        <button
                            type="button"
                            onClick={() =>
                                dispatch(
                                    listWorkspace({
                                        skip: 0,
                                        limit: 12,
                                        search: "",
                                    }),
                                )
                            }
                            className="mt-3 text-sm font-semibold underline"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            )}

            {/* Workspace cards */}
            {!isWorkspaceLoading.list &&
                !workspaceError &&
                listofWorkspace.length > 0 && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {listofWorkspace.map((workspace) => (
                            <article
                                key={workspace._id}
                                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                            >
                                {/* Card header */}
                                <div className="border-b border-slate-100 p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                                            <Building2 size={24} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-lg font-bold text-slate-800">
                                                {workspace.reportMode?.name ??
                                                    "Unnamed Report Mode"}
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {workspace.company?.name ??
                                                    "No company"}
                                            </p>
                                        </div>

                                        <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                            Workspace
                                        </span>
                                    </div>
                                </div>

                                {/* Card details */}
                                <div className="space-y-4 p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-slate-100 p-2 text-slate-500">
                                            <FileText size={17} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-slate-400">
                                                Category
                                            </p>
                                            <p className="truncate text-sm font-semibold text-slate-700">
                                                {workspace.category?.name ??
                                                    "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-slate-100 p-2 text-slate-500">
                                            <Layers3 size={17} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-slate-400">
                                                Segment
                                            </p>
                                            <p className="text-sm font-semibold text-slate-700">
                                                {workspace.segment ??
                                                    "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-slate-100 p-2 text-slate-500">
                                            <Users size={17} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-slate-400">
                                                Created By
                                            </p>
                                            <p className="truncate text-sm font-semibold text-slate-700">
                                                {workspace.user?.name ??
                                                    workspace.user?.userCode ??
                                                    "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card footer */}
                                <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-3">
                                    <CalendarDays
                                        size={15}
                                        className="text-slate-400"
                                    />
                                    <span className="text-xs text-slate-500">
                                        Created{" "}
                                        {formatDate(workspace.createdAt)}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

            {/* Empty state */}
            {!isWorkspaceLoading.list &&
                !workspaceError &&
                listofWorkspace.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <Layers3 size={28} />
                        </div>

                        <h3 className="text-lg font-semibold text-slate-800">
                            No workspaces found
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Create a workspace to see it here.
                        </p>
                    </div>
                )}
        </div>
    );
};

export default Dashboard;
