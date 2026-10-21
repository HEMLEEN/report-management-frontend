
import {
    Pencil,
    Plus,
    Trash2,
    Search,
    X,
    Tags,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    createReportMode,
    listReportMode,
    listCategory,
    listCompany,
    assignCategory,
    assignCompany,
} from "../../redux/slices/setup/thunkApi";

import CreationFormModal from "../Admin/CreationFormModal";
import AssignReportModal, {
    AssignReportData,
    AssignReportOption,
} from "./component/AssignReportModal";

interface ApiAssignment {
    _id?: string;
    id?: string;
    name?: string;
}

type AssignmentValue = string | ApiAssignment;

interface ApiRecord {
    _id?: string;
    id?: string;
    name?: string;
    category?: AssignmentValue[] | AssignmentValue;
    categories?: AssignmentValue[];
    compny?: AssignmentValue[] | AssignmentValue;
    company?: AssignmentValue[] | AssignmentValue;
    companies?: AssignmentValue[];
}

export interface CreationRecord {
    id: string;
    name: string;
    status?: string;
    assignedCategories: AssignReportOption[];
    assignedCompanies: AssignReportOption[];
}

interface ApiListResponse {
    data?: {
        categoryList?: ApiRecord[];
        companyList?: ApiRecord[];
        items?: ApiRecord[];
    };
    items?: ApiRecord[];
}

const normalizeAssignments = (
    value?: AssignmentValue[] | AssignmentValue
): AssignReportOption[] => {
    if (!value) return [];

    const items = Array.isArray(value) ? value : [value];

    return items
        .map((item) => {
            if (typeof item === "string") {
                return {
                    _id: item,
                    name: item,
                };
            }

            const id = item._id ?? item.id ?? "";

            return {
                _id: id,
                name: item.name ?? id,
            };
        })
        .filter((item) => item._id !== "");
};

const normalizeRecords = (
    items: ApiRecord[] = []
): CreationRecord[] =>
    items.map((item) => ({
        id: item._id ?? item.id ?? "",
        name: item.name ?? "",
        assignedCategories: normalizeAssignments(
            item.category ?? item.categories
        ),
        assignedCompanies: normalizeAssignments(
            item.compny ?? item.company ?? item.companies
        ),
    }));

const getItems = (
    result: unknown,
    type: "category" | "company"
): AssignReportOption[] => {
    const response = result as ApiListResponse;

    const items =
        type === "category"
            ? response?.data?.categoryList
            : response?.data?.companyList;

    const list = items ?? response?.data?.items ?? response?.items ?? [];

    return list
        .map((item) => ({
            _id: item._id ?? item.id ?? "",
            name: item.name ?? "",
        }))
        .filter((item) => item._id !== "");
};

const ReportMode = () => {
    const dispatch = useAppDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] =
        useState<CreationRecord | null>(null);

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedReportMode, setSelectedReportMode] =
        useState<CreationRecord | null>(null);

    const [categories, setCategories] =
        useState<AssignReportOption[]>([]);
    const [companies, setCompanies] =
        useState<AssignReportOption[]>([]);

    const [isOptionsLoading, setIsOptionsLoading] = useState(false);
    const [isAssignSaving, setIsAssignSaving] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    const {
        listOfReportMode,
        totalReportRecords,
        isReportModeLoading,
        reportModeError,
    } = useAppSelector((state) => state.reportMode);

    useEffect(() => {
        const timer = setTimeout(() => {
            void dispatch(
                listReportMode({
                    search: searchTerm.trim(),
                    limit: pageSize,
                    skip: (currentPage - 1) * pageSize,
                })
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [dispatch, searchTerm, currentPage, pageSize]);

    const records = normalizeRecords(
        (listOfReportMode ?? []) as ApiRecord[]
    );

    const refresh = useCallback(async () => {
        await dispatch(
            listReportMode({
                search: searchTerm.trim(),
                limit: pageSize,
                skip: (currentPage - 1) * pageSize,
            })
        ).unwrap();
    }, [dispatch, searchTerm, pageSize, currentPage]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const openAddModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: CreationRecord) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSave = async (data: { name: string }) => {
        const name = data.name.trim();

        if (!name) return;

        try {
            if (editingItem) {
                console.warn(
                    "Connect the updateReportMode thunk to enable editing."
                );
                return;
            }

            await dispatch(createReportMode({ name })).unwrap();
            await refresh();
            closeModal();
        } catch (error: unknown) {
            console.error("Failed to save report mode:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!id) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this report mode?"
        );

        if (!confirmed) return;

        // Connect your deleteReportMode thunk here.
        console.warn("Connect the report-mode delete API:", id);
    };

    const openAssignModal = async (item: CreationRecord) => {
        setSelectedReportMode(item);
        setCategories([]);
        setCompanies([]);
        setIsAssignModalOpen(true);
        setIsOptionsLoading(true);

        try {
            const [categoryResult, companyResult] = await Promise.all([
                dispatch(
                    listCategory({
                        search: "",
                        limit: 100,
                        skip: 0,
                    })
                ).unwrap(),
                dispatch(
                    listCompany({
                        search: "",
                        limit: 100,
                        skip: 0,
                    })
                ).unwrap(),
            ]);

            setCategories(getItems(categoryResult, "category"));
            setCompanies(getItems(companyResult, "company"));
        } catch (error: unknown) {
            console.error(
                "Failed to load categories or companies:",
                error
            );
        } finally {
            setIsOptionsLoading(false);
        }
    };

    const closeAssignModal = () => {
        if (isAssignSaving) return;

        setIsAssignModalOpen(false);
        setSelectedReportMode(null);
    };

    const handleAssign = async (data: AssignReportData) => {
        if (!selectedReportMode) return;

        setIsAssignSaving(true);

        try {
            if (data.type === "category") {
                await dispatch(
                    assignCategory({
                        reportModeId: selectedReportMode.id,
                        category: data.ids,
                    })
                ).unwrap();
            } else {
                await dispatch(
                    assignCompany({
                        reportModeId: selectedReportMode.id,
                        company: data.ids,
                    })
                ).unwrap();
            }

            await refresh();

            setIsAssignModalOpen(false);
            setSelectedReportMode(null);
        } catch (error: unknown) {
            console.error(
                `Failed to save ${data.type} assignment:`,
                error
            );
        } finally {
            setIsAssignSaving(false);
        }
    };

    const totalPages = Math.max(
        1,
        Math.ceil((totalReportRecords ?? 0) / pageSize)
    );

    return (
        <div>
            <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            Report Mode List
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {totalReportRecords}{" "}
                            {totalReportRecords === 1
                                ? "record"
                                : "records"}{" "}
                            found
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        Add Report Mode
                    </button>
                </div>

                <div className="border-b border-slate-200 p-4">
                    <div className="relative w-full sm:max-w-sm">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                handleSearch(event.target.value)
                            }
                            placeholder="Search report mode..."
                            aria-label="Search report modes"
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => handleSearch("")}
                                aria-label="Clear search"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[950px] text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                            <tr>
                                <th className="px-5 py-4 font-semibold">
                                    S.No
                                </th>
                                <th className="px-5 py-4 font-semibold">
                                    Report Mode
                                </th>
                                <th className="px-5 py-4 font-semibold">
                                    Assigned Categories
                                </th>
                                <th className="px-5 py-4 font-semibold">
                                    Assigned Companies
                                </th>
                                <th className="px-5 py-4 text-right font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {isReportModeLoading.list ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-12 text-center text-slate-500"
                                    >
                                        Loading report modes...
                                    </td>
                                </tr>
                            ) : reportModeError ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-12 text-center text-red-500"
                                    >
                                        {String(reportModeError)}
                                    </td>
                                    </tr>
                                ) : records.length > 0 ? (
                                    records.map((item, index) => (
                                        <tr
                                            key={item.id || item.name}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-5 py-4 text-slate-500">
                                                {(currentPage - 1) * pageSize +
                                                    index +
                                                    1}
                                            </td>

                                            <td className="px-5 py-4 font-medium text-slate-800">
                                                {item.name}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {item.assignedCategories.length >
                                                        0 ? (
                                                        item.assignedCategories.map(
                                                            (category) => (
                                                                <span
                                                                    key={category._id}
                                                                    className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                                                                >
                                                                    {category.name}
                                                                </span>
                                                            )
                                                        )
                                                    ) : (
                                                        <span className="text-xs text-slate-400">
                                                            Not assigned
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {item.assignedCompanies.length >
                                                        0 ? (
                                                        item.assignedCompanies.map(
                                                            (company) => (
                                                                <span
                                                                    key={company._id}
                                                                    className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700"
                                                                >
                                                                    {company.name}
                                                                </span>
                                                            )
                                                        )
                                                    ) : (
                                                        <span className="text-xs text-slate-400">
                                                            Not assigned
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            void openAssignModal(item)
                                                        }
                                                        title={`Assign category/company to ${item.name}`}
                                                        aria-label={`Assign options to ${item.name}`}
                                                        className="rounded-lg p-2 text-purple-600 transition hover:bg-purple-50"
                                                    >
                                                        <Tags size={17} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditModal(item)
                                                        }
                                                        title={`Edit ${item.name}`}
                                                        aria-label={`Edit ${item.name}`}
                                                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                                    >
                                                        <Pencil size={17} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            void handleDelete(item.id)
                                                        }
                                                        title={`Delete ${item.name}`}
                                                        aria-label={`Delete ${item.name}`}
                                                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                                                    >
                                                        <Trash2 size={17} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-5 py-12 text-center"
                                            >
                                                <p className="font-medium text-slate-700">
                                                        No report modes found
                                                    </p>
                                                    <p className="mt-1 text-slate-500">
                                                        {searchTerm
                                                            ? "Try another search term."
                                                : "Click Add Report Mode to create your first record."}
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500">
                            Page {currentPage} of {totalPages}
                        </p>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                disabled={currentPage <= 1}
                                onClick={() =>
                                    setCurrentPage((page) => page - 1)
                                }
                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <button
                                type="button"
                                disabled={currentPage >= totalPages}
                                onClick={() =>
                                    setCurrentPage((page) => page + 1)
                                }
                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {isModalOpen && (
                <CreationFormModal
                    type="reportMode"
                    editingItem={editingItem}
                    onClose={closeModal}
                    onSubmit={handleSave}
                />
            )}

            {isAssignModalOpen && selectedReportMode && (
                <AssignReportModal
                    key={selectedReportMode.id}
                    reportModeId={selectedReportMode.id}
                    reportModeName={selectedReportMode.name}
                    categories={categories}
                    companies={companies}
                    assignedCategoryIds={selectedReportMode.assignedCategories.map(
                        (item) => item._id
                    )}
                    assignedCompanyIds={selectedReportMode.assignedCompanies.map(
                        (item) => item._id
                    )}
                    loading={isOptionsLoading || isAssignSaving}
                    onClose={closeAssignModal}
                    onSubmit={handleAssign}
                />
            )}
        </div>
    );
};

export default ReportMode;
