import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store";
import {
    AlertCircle,
    Building2,
    CalendarDays,
    FileText,
    Layers3,
    Plus,
    RefreshCw,
    Users,
} from "lucide-react";
import { byUserCodeWorkspace } from "../../redux/slices/workspace/thunkApi";

interface LoggedInUser {
    userCode: string;
    name?: string;
}

function getLoggedInUser(): LoggedInUser | null {
    try {
        const rawLogin = localStorage.getItem("login");

        if (!rawLogin) return null;

        const login: unknown = JSON.parse(rawLogin);

        if (!login || typeof login !== "object") return null;

        const data = login as Record<string, unknown>;

        // Supports common login response structures.
        const nestedData = data.data;
        const nestedUser = data.user;

        const responseData =
            nestedData && typeof nestedData === "object"
                ? (nestedData as Record<string, unknown>)
                : {};

        const responseUser =
            nestedUser && typeof nestedUser === "object"
                ? (nestedUser as Record<string, unknown>)
                : {};

        const dataUser =
            responseData.user && typeof responseData.user === "object"
                ? (responseData.user as Record<string, unknown>)
                : {};

        const userCode =
            responseUser.userCode ??
            responseData.userCode ??
            dataUser.userCode ??
            data.userCode;

        const name =
            responseUser.name ??
            responseData.name ??
            dataUser.name ??
            data.name;

        if (typeof userCode !== "string" || !userCode.trim()) {
            return null;
        }

        return {
            userCode: userCode.trim(),
            ...(typeof name === "string" ? { name } : {}),
        };
    } catch (error) {
        console.error("Unable to read login data:", error);
        return null;
    }
}

const UserDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [user, setUser] = useState<LoggedInUser | null>(null);
    const [userInitialized, setUserInitialized] = useState(false);

    const {
        byUserCode,
        isWorkspaceLoading,
        workspaceError,
    } = useSelector((state: RootState) => state.workspace);

    useEffect(() => {
        setUser(getLoggedInUser());
        setUserInitialized(true);
    }, []);

    const fetchWorkspace = useCallback(() => {
        if (!user?.userCode) return;

        dispatch(
            byUserCodeWorkspace({
                userCode: user.userCode,
            }),
        );
    }, [dispatch, user?.userCode]);

    useEffect(() => {
        if (userInitialized && user?.userCode) {
            fetchWorkspace();
        }
    }, [userInitialized, user?.userCode, fetchWorkspace]);

    const formatDate = (date?: string) => {
        if (!date) return "N/A";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return "N/A";

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Use the loading flag for this specific API request.
    const isLoading =
        !userInitialized || isWorkspaceLoading.byUserCode;

    const workspaceCount = Array.isArray(byUserCode)
        ? byUserCode.length
        : 0;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            {/* Header actions */}
            <div className="mb-8 flex flex-col justify-end gap-3 sm:flex-row sm:items-center">

                {workspaceCount > 0 && (<button
                    type="button"
                    onClick={() => navigate("/workspace")}
                    disabled={!userInitialized || !user?.userCode}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Plus size={16} />
                    Add New Workspace
                </button>)}
                {workspaceCount > 0 && (<button
                    type="button"
                    onClick={() => navigate("/reportUi")}
                    disabled={!userInitialized || !user?.userCode}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Plus size={16} />
                    Report UI
                </button>)}
                <button
                    type="button"
                    onClick={fetchWorkspace}
                    disabled={isLoading || !user?.userCode}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        size={16}
                        className={isLoading ? "animate-spin" : ""}
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
                                {isLoading ? "—" : workspaceCount}
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
                                {isLoading ? "—" : workspaceCount}
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

            {/* Loading skeleton */}
            {isLoading && (
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

            {/* Missing login */}
            {userInitialized && !user?.userCode && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                    Unable to identify the logged-in user. Please log in
                    again.
                </div>
            )}

            {/* API error */}
            {!isLoading &&
                user?.userCode &&
                workspaceError && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                        <AlertCircle
                            size={22}
                            className="mt-0.5 shrink-0"
                        />

                        <div>
                            <h3 className="font-semibold">
                                Failed to load workspaces
                            </h3>

                            <p className="mt-1 text-sm">
                                {workspaceError}
                            </p>

                            <button
                                type="button"
                                onClick={fetchWorkspace}
                                className="mt-3 text-sm font-semibold underline"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                )}

            {/* Workspace cards */}
            {!isLoading &&
                user?.userCode &&
                !workspaceError &&
                workspaceCount > 0 && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {byUserCode.map((workspace) => (
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
                                <div className="space-y-4 p-5" >
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
                                                {workspace.segment ?? "N/A"}
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
                                                    user.name ??
                                                    user.userCode}
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
            {!isLoading &&
                user?.userCode &&
                !workspaceError &&
                workspaceCount === 0 && (
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

                        <button
                            type="button"
                            onClick={() => navigate("/workspace")}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
                        >
                            <Plus size={16} />
                            Create Workspace
                        </button>
                    </div>
                )}
        </div>
    );
};

export default UserDashboard;