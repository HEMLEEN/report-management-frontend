import { Pencil, Plus, Trash2, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { HiUserGroup } from "react-icons/hi";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { UserRole, UserStatus } from "../../enum/Enum";
import { approveUser, assignRole, listUser } from "../../redux/slices/user/thunkApi";

import CreationFormModal from "../Admin/CreationFormModal";
import Pagination from "./Pagination";
import AssignRoleModal from "./component/AssinRoleModal";

interface UserApiRecord {
    _id?: string;
    id?: string;
    userCode?: string;
    name?: string;
    roles?: string[];
    status?: string;
}

interface UserRecord {
    id: string;
    userCode: string;
    name: string;
    roles: string[];
    status: string;
}

interface AssignRoleFormData {
    roles: UserRole[];
}

const normalizeUserRecords = (
    items: UserApiRecord[] = []
): UserRecord[] =>
    items.map((item) => ({
        id: item._id ?? item.id ?? "",
        userCode: item.userCode ?? "",
        name: item.name ?? "",
        roles: Array.isArray(item.roles) ? item.roles : [],
        status: item.status ?? "",
    }));

const User = () => {
    const dispatch = useAppDispatch();

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAssignRoleModal, setShowAssignRoleModal] =
        useState(false);

    // Selected user for role assignment
    const [selectedUser, setSelectedUser] =
        useState<UserRecord | null>(null);

    // Selected user for editing
    const [editingItem, setEditingItem] =
        useState<UserRecord | null>(null);

    // Search and pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const {
        listOfUsers,
        totalUserRecords,
        isUserLoading,
        userError,
    } = useAppSelector((state) => state.user);

    // Fetch users with server-side search and pagination
    useEffect(() => {
        const timer = setTimeout(() => {
            void dispatch(
                listUser({
                    search: searchTerm.trim(),
                    limit: pageSize,
                    skip: (currentPage - 1) * pageSize,
                })
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [dispatch, searchTerm, currentPage, pageSize]);

    const records = normalizeUserRecords(
        listOfUsers as UserApiRecord[]
    );

    // Refresh the current page
    const refresh = useCallback(async () => {
        await dispatch(
            listUser({
                search: searchTerm.trim(),
                limit: pageSize,
                skip: (currentPage - 1) * pageSize,
            })
        ).unwrap();
    }, [dispatch, searchTerm, pageSize, currentPage]);

    // Search users
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    // Open create-user modal
    const openAddModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    // Open edit-user modal
    const openEditModal = (item: UserRecord) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    // Close create/edit modal
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    // Open role-assignment modal for the selected user
    const openAssignModal = (item: UserRecord) => {
        setSelectedUser(item);
        setShowAssignRoleModal(true);
    };

    const closeAssignModal = () => {
        setShowAssignRoleModal(false);
        setSelectedUser(null);
    };

    // Save user
    const handleSave = async (data: { name: string }) => {
        const name = data.name.trim();

        if (!name) return;

        try {
            if (editingItem) {
                // TODO: Dispatch your user-update thunk here.
                // Example: await dispatch(updateUser(...)).unwrap();
            } else {
                // TODO: Dispatch your user-create thunk here.
                // Example: await dispatch(createUser(...)).unwrap();
            }

            // Refresh and close after connecting the API successfully.
            // Keep these calls after the create/update thunk succeeds.
            await refresh();
            closeModal();
        } catch (error: unknown) {
            console.error("Failed to save user:", error);
        }
    };

    // Delete user
    const handleDelete = async (id: string) => {
        if (!id) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmed) return;

        try {
            // TODO: Dispatch your user-delete thunk here.
            // Example: await dispatch(deleteUser(id)).unwrap();

            console.log("Connect delete-user API for:", id);

            // Refresh after the delete API succeeds.
        } catch (error: unknown) {
            console.error("Failed to delete user:", error);
        }
    };

    // Toggle user status: Active <-> Inactive
    const handleApprove = async (item: UserRecord) => {
        try {
            const newStatus =
                item.status === UserStatus.ACTIVE
                    ? UserStatus.INACTIVE
                    : UserStatus.ACTIVE;

            await dispatch(
                approveUser({
                    userCode: item.userCode,
                    status: newStatus,
                })
            ).unwrap();

            await refresh();
        } catch (error: unknown) {
            console.error(
                "Failed to update user status:",
                error
            );
        }
    };

    // Submit assigned roles
    const handleAssignRoles = async (
        data: AssignRoleFormData
    ) => {
        if (!selectedUser) return;
        console.log('data', data)

        try {
            await dispatch(
                assignRole({
                    userCode: selectedUser.userCode,
                    roles: data.roles,
                })
            ).unwrap();

            console.log("User:", selectedUser.userCode);
            console.log("Assigned roles:", data.roles);

            // Refresh after the role-assignment API succeeds.
            await refresh();
            closeAssignModal();
        } catch (error: unknown) {
            console.error("Failed to assign roles:", error);
        }
    };

    return (
        <div>
            <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            User List
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {totalUserRecords}{" "}
                            {totalUserRecords === 1
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
                        Add User
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
                            placeholder="Search user ID, name..."
                            aria-label="Search users"
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

                {/* User table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[750px] text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                            <tr>
                                <th className="px-5 py-4 font-semibold">
                                    User ID
                                </th>

                                <th className="px-5 py-4 font-semibold">
                                    Name
                                </th>

                                <th className="px-5 py-4 font-semibold">
                                    Status
                                </th>

                                <th className="px-5 py-4 font-semibold">
                                    Allow
                                </th>

                                <th className="px-5 py-4 text-right font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {isUserLoading.list ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-12 text-center text-slate-500"
                                    >
                                        Loading users...
                                    </td>
                                </tr>
                            ) : userError ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-12 text-center text-red-500"
                                    >
                                        {String(userError)}
                                    </td>
                                </tr>
                            ) : records.length > 0 ? (
                                        records.map((item) => {
                                            const isActive =
                                                item.status === UserStatus.ACTIVE;

                                            return (
                                                <tr
                                                    key={
                                                        item.id || item.userCode
                                                    }
                                                    className="transition hover:bg-slate-50"
                                                >
                                                    <td className="px-5 py-4 text-slate-500">
                                                        {item.userCode}
                                                    </td>

                                                    <td className="px-5 py-4 font-medium text-slate-800">
                                                        {item.name || "-"}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isActive
                                                                ? "bg-green-50 text-green-700"
                                                                : "bg-yellow-50 text-yellow-700"
                                                                }`}
                                                        >
                                                            {isActive
                                                                ? "Active"
                                                                : "Pending"}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleApprove(item)
                                                            }
                                                            disabled={
                                                                isUserLoading.list
                                                            }
                                                            className={`rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${isActive
                                                                ? "text-yellow-600 hover:bg-yellow-50"
                                                                : "text-green-600 hover:bg-green-50"
                                                                }`}
                                                        >
                                                            {isActive
                                                                ? "Deactivate"
                                                                : "Approve"}
                                                        </button>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            {/* Assign roles */}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openAssignModal(
                                                                        item
                                                                    )
                                                                }
                                                                title={`Assign roles to ${item.name || item.userCode}`}
                                                                aria-label={`Assign roles to ${item.userCode}`}
                                                                className="rounded-lg p-2 text-purple-600 transition hover:bg-purple-50"
                                                            >
                                                                <HiUserGroup
                                                                    size={18}
                                                                />
                                                            </button>

                                                            {/* Edit user */}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        item
                                                                    )
                                                                }
                                                                title={`Edit ${item.name || item.userCode}`}
                                                                aria-label={`Edit ${item.userCode}`}
                                                                className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                                            >
                                                                <Pencil size={17} />
                                                            </button>

                                                            {/* Delete user */}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        item.id
                                                                    )
                                                                }
                                                                title={`Delete ${item.name || item.userCode}`}
                                                                aria-label={`Delete ${item.userCode}`}
                                                                className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                                                            >
                                                                <Trash2 size={17} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-12 text-center"
                                    >
                                        <p className="font-medium text-slate-700">
                                            No users found
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

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalRecords={totalUserRecords}
                    loading={isUserLoading.list}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(size) => {
                        setPageSize(size);
                        setCurrentPage(1);
                    }}
                />
            </section>

            {/* Create / Edit User Modal */}
            {isModalOpen && (
                <CreationFormModal
                    type="user"
                    editingItem={editingItem}
                    onClose={closeModal}
                    onSubmit={handleSave}
                />
            )}

            {/* Assign Role Modal */}
            {showAssignRoleModal && selectedUser && (
                <AssignRoleModal
                    userName={selectedUser.userCode}
                    currentRoles={
                        selectedUser.roles as UserRole[]
                    }
                    onClose={closeAssignModal}
                    onSubmit={handleAssignRoles}
                />
            )}
        </div>
    );
};

export default User;