import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { FormEvent } from "react";
import type { AppDispatch, RootState } from "../../redux/store";
import { listWorkspace } from "../../redux/slices/workspace/thunkApi";
import {
    AlertCircle,
    Building2,
    CalendarDays,
    FileText,
    Layers3,
    RefreshCw,
    Search,
    Users,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";

const PAGE_SIZE = 12;

const AdminWorkspace = () => {
    const dispatch = useDispatch<AppDispatch>();

    const {
        listofWorkspace,
        totalRecords,
        isWorkspaceLoading,
        workspaceError,
    } = useSelector((state: RootState) => state.workspace);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const isLoading = isWorkspaceLoading.list;
    const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));

    const fetchWorkspaces = useCallback(() => {
        dispatch(
            listWorkspace({
                skip: (page - 1) * PAGE_SIZE,
                limit: PAGE_SIZE,
                search,
            }),
        );
    }, [dispatch, page, search]);

    // Fetch all workspaces for the current admin search/page.
    useEffect(() => {
        fetchWorkspaces();
    }, [fetchWorkspaces]);

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setPage(1);
        setSearch(searchInput.trim());
    };

    const clearSearch = () => {
        setSearchInput("");
        setSearch("");
        setPage(1);
    };

    const changePage = (nextPage: number) => {
        if (nextPage < 1 || nextPage > totalPages || isLoading) {
            return;
        }

        setPage(nextPage);
    };

    const formatDate = (date?: string) => {
        if (!date) return "N/A";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "N/A";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const loadedCount = Array.isArray(listofWorkspace)
        ? listofWorkspace.length
        : 0;

    const startRecord =
        totalRecords === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;

    const endRecord = Math.min(
        (page - 1) * PAGE_SIZE + loadedCount,
        totalRecords,
    );

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                            <Users size={14} />
                            Administration
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                            Workspace Management
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            View and monitor workspaces created by all users.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={fetchWorkspaces}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            size={16}
                            className={isLoading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>

                {/* Summary cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Total Workspaces
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                                    {isLoading && totalRecords === 0
                                        ? "—"
                                        : totalRecords}
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Matching all users
                                </p>
                            </div>

                            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                                <Layers3 size={25} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Loaded Workspaces
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                                    {loadedCount}
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Current page
                                </p>
                            </div>

                            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                                <FileText size={25} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col gap-3 sm:flex-row"
                    >
                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="search"
                                value={searchInput}
                                onChange={(event) =>
                                    setSearchInput(event.target.value)
                                }
                                placeholder="Search workspaces..."
                                aria-label="Search workspaces"
                                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            />

                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={() => setSearchInput("")}
                                    aria-label="Clear search input"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Search size={16} />
                            Search
                        </button>

                        {search && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                disabled={isLoading}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                            >
                                <X size={16} />
                                Clear
                            </button>
                        )}
                    </form>

                    {search && (
                        <p className="mt-3 text-xs text-slate-500">
                            Search results for:{" "}
                            <span className="font-semibold text-slate-700">
                                {search}
                            </span>
                        </p>
                    )}
                </div>

                {/* Workspace list heading */}
                <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            All Workspaces
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Workspace details, ownership, and creation dates.
                        </p>
                    </div>

                    {!isLoading && !workspaceError && totalRecords > 0 && (
                        <p className="text-sm text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {startRecord}–{endRecord}
                            </span>{" "}
                            of {totalRecords}
                        </p>
                    )}
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
                                        <div className="h-3 w-1/2 rounded bg-slate-100" />
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
                {!isLoading && workspaceError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                        <div className="flex items-start gap-3 text-red-700">
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
                                    onClick={fetchWorkspaces}
                                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold underline"
                                >
                                    <RefreshCw size={14} />
                                    Try again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Workspace cards */}
                {!isLoading &&
                    !workspaceError &&
                    loadedCount > 0 && (
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
                                                <h3
                                                    className="truncate text-lg font-bold text-slate-800"
                                                    title={
                                                        workspace.reportMode?.name
                                                    }
                                                >
                                                    {workspace.reportMode?.name ??
                                                        "Unnamed Report Mode"}
                                                </h3>

                                                <p className="mt-1 truncate text-sm text-slate-500">
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
                                                        "N/A"}
                                                </p>

                                                {workspace.user?.userCode && (
                                                    <p className="mt-0.5 text-xs text-slate-400">
                                                        ID:{" "}
                                                        {workspace.user.userCode}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card footer */}
                                    <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-3">
                                        <CalendarDays
                                            size={15}
                                            className="shrink-0 text-slate-400"
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
                    !workspaceError &&
                    loadedCount === 0 && (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <Layers3 size={28} />
                            </div>

                            <h3 className="text-lg font-semibold text-slate-800">
                                {search
                                    ? "No matching workspaces"
                                    : "No workspaces found"}
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                {search
                                    ? "Try a different search term."
                                    : "Workspaces created by users will appear here."}
                            </p>

                            {search && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}

                {/* Pagination */}
                {!isLoading &&
                    !workspaceError &&
                    totalRecords > PAGE_SIZE && (
                        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row">
                            <p className="text-sm text-slate-500">
                                Page{" "}
                                <span className="font-semibold text-slate-800">
                                    {page}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-slate-800">
                                    {totalPages}
                                </span>
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => changePage(page - 1)}
                                    disabled={page === 1 || isLoading}
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft size={16} />
                                    Previous
                                </button>

                                <button
                                    type="button"
                                    onClick={() => changePage(page + 1)}
                                    disabled={
                                        page >= totalPages || isLoading
                                    }
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
            </div>
        </main>
    );
};

export default AdminWorkspace;