import { Pencil, Plus, Trash2, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { listCategory } from "../../redux/slices/setup/thunkApi";

interface ApiRecord {
    _id?: string;
    id?: string;
    name: string;
}

export interface CreationRecord {
    id: string;
    name: string;
    status?: string
}

const normalizeRecords = (
    items: ApiRecord[] = []
): CreationRecord[] =>
    items.map((item) => ({
        id: item._id ?? item.id ?? "",
        name: item.name,
    }));

const Category = () => {
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] =
        useState<ApiRecord | null>(null);

    // Search and pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const {
        listOfCategories,
        totalRecords,
        isCategoryLoading,
        categoryError
    } = useAppSelector((state) => state.category);

    // Fetch the requested page from MongoDB
    useEffect(() => {
        const timer = setTimeout(() => {
            void dispatch(
                listCategory({
                    search: searchTerm.trim(),
                    limit: pageSize,
                    skip: (currentPage - 1) * pageSize,
                })
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [dispatch, searchTerm, currentPage, pageSize]);

    const records = normalizeRecords(
        listOfCategories as ApiRecord[]
    );

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const refresh = async () => {
        await dispatch(
            listCategory({
                search: searchTerm.trim(),
                limit: pageSize,
                skip: (currentPage - 1) * pageSize,
            })
        ).unwrap();
    };

    const openAddModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: ApiRecord) => {
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
                // Connect your user-update thunk here.
                return;
            }

            // Connect your user-create thunk here.
            await refresh();
            closeModal();
        } catch (error: unknown) {
            console.error("Failed to save user:", error);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this record?"
        );

        if (!confirmed) return;

        // Dispatch your user-delete thunk here.
        // Call refresh() after successful deletion.
        console.log("Delete user:", id);
    };

    return (
        <div>
            <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            Category List
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {totalRecords}{" "}
                            {totalRecords === 1 ? "record" : "records"} found
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

                {/* Search */}
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
                            placeholder="Search name..."
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

                {/* table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                            <tr>
                                <th className="px-5 py-4 font-semibold">
                                    S.No
                                </th>
                                <th className="px-5 py-4 font-semibold">
                                    Name
                                </th>
                                <th className="px-5 py-4 text-right font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {isCategoryLoading.list ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-12 text-center text-slate-500"
                                    >
                                        Loading reports...
                                    </td>
                                </tr>
                            ) : categoryError ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-12 text-center text-red-500"
                                    >
                                        {String(categoryError)}
                                    </td>
                                </tr>) :
                                records.length > 0 ? (
                                    records.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-5 py-4 text-slate-500">
                                                {index + 1}
                                            </td>

                                            <td className="px-5 py-4 font-medium text-slate-800">
                                                {item.name}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        // onClick={() => openEditModal(item)}
                                                        title={`Edit ${item.name}`}
                                                        aria-label={`Edit ${item.name}`}
                                                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                                    >
                                                        <Pencil size={17} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item.id)}
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
                                                No categories found
                                            </p>
                                            <p className="mt-1 text-slate-500">
                                                {searchTerm
                                                    ? "Try another search term."
                                                    : "Click Add User to create your first record."}
                                            </p>
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}

export default Category