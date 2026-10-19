
import { useEffect, useState } from "react";
import {
    UserPlus,
    FilePlus2,
    Tags,
    Building2,
    ArrowUpRight,
    LogOut,
} from "lucide-react";

import CreationList from "./CreationList";
import CreationFormModal from "./CreationFormModal";

import type {
    CreationFormValues,
    CreationRecord,
    CreationType,
} from "./creation.types";

import {
    approveUser,
    createReportMode,
    listCategory,
    listCompany,
    listReportMode,
    listUser,
} from "../../redux/slices/setup/thunkApi";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { UserStatus } from "../../enum/Enum";
import { logout } from "../../redux/slices/auth/loginSlice";
import { useNavigate } from "react-router-dom";

interface CreationItem {
    title: string;
    description: string;
    icon: typeof UserPlus;
    type: CreationType;
    iconColor: string;
    iconBg: string;
}

interface ApiRecord {
    _id?: string;
    id?: string;
    name: string;
}

interface UserApiRecord {
    _id?: string;
    id?: string;
    userCode?: string;
    name: string;
    roles: string[],
    status: string
}

const creationItems: CreationItem[] = [
    {
        title: "User",
        description: "Create and manage user accounts.",
        icon: UserPlus,
        type: "user",
        iconColor: "text-blue-600",
        iconBg: "bg-blue-50",
    },
    {
        title: "Report Mode",
        description: "Configure report modes for your workflow.",
        icon: FilePlus2,
        type: "reportMode",
        iconColor: "text-violet-600",
        iconBg: "bg-violet-50",
    },
    {
        title: "Category",
        description: "Organize reports into categories.",
        icon: Tags,
        type: "category",
        iconColor: "text-emerald-600",
        iconBg: "bg-emerald-50",
    },
    {
        title: "Company",
        description: "Register and manage companies.",
        icon: Building2,
        type: "company",
        iconColor: "text-orange-600",
        iconBg: "bg-orange-50",
    },
];

const normalizeRecords = (
    items: ApiRecord[] = []
): CreationRecord[] =>
    items.map((item) => ({
        id: item._id ?? item.id ?? "",
        name: item.name,
    }));

const normalizeUserRecords = (
    items: UserApiRecord[] = []
): any[] =>
    items.map((item) => ({
        id: item._id ?? item.id ?? "",
        userCode: item.userCode,
        name: item.name,
        roles: item.roles || [],
        status: item.status
    }));

const CreationCard = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [selectedType, setSelectedType] =
        useState<CreationType | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingItem, setEditingItem] =
        useState<CreationRecord | null>(null);

    const {
        list: reportModeList,
        isReportModeLoading,
        reportModeError,
    } = useAppSelector((state) => state.reportMode);

    const {
        listOfCategories,
        isCategoryLoading,
        categoryError,
    } = useAppSelector((state) => state.category);

    const {
        listOfCompanies,
        isCompanyLoading,
        companyError,
    } = useAppSelector((state) => state.company);

    const {
        listOfUsers,
        isUserLoading,
        userError,
    } = useAppSelector((state) => state.user);

    // Fetch the selected list.
    useEffect(() => {
        if (!selectedType) return;

        switch (selectedType) {
            case "reportMode":
                void dispatch(listReportMode({ name: "" }));
                break;

            case "category":
                void dispatch(listCategory({ name: "" }));
                break;

            case "company":
                void dispatch(listCompany({ name: "" }));
                break;

            case "user":
                void dispatch(listUser({ name: "" }));
                break;
        }
    }, [dispatch, selectedType]);

    // Get records from Redux.
    const records: CreationRecord[] = (() => {
        switch (selectedType) {
            case "reportMode":
                return normalizeRecords(
                    reportModeList as ApiRecord[]
                );

            case "category":
                return normalizeRecords(
                    listOfCategories as ApiRecord[]
                );

            case "company":
                return normalizeRecords(
                    listOfCompanies as ApiRecord[]
                );

            case "user":
                return normalizeUserRecords(
                    listOfUsers as UserApiRecord[]
                );

            default:
                return [];
        }
    })();

    // Get loading status for the selected list.
    const loadingMap: Record<CreationType, boolean> = {
        reportMode: isReportModeLoading.list,
        category: isCategoryLoading.list,
        company: isCompanyLoading.list,
        user: isUserLoading.list,
    };

    const isLoading = selectedType
        ? loadingMap[selectedType]
        : false;

    // Get only the selected list's error.
    const errorMap: Record<CreationType, unknown> = {
        reportMode: reportModeError,
        category: categoryError,
        company: companyError,
        user: userError,
    };

    const loadError = selectedType
        ? errorMap[selectedType]
        : null;

    const hasLoadError =
        loadError !== null &&
        loadError !== undefined &&
        loadError !== false &&
        loadError !== "";

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

    // Refresh the list for the selected type.
    const refreshSelectedList = async (
        type: CreationType
    ) => {
        switch (type) {
            case "reportMode":
                await dispatch(
                    listReportMode({ name: "" })
                ).unwrap();
                break;

            case "category":
                await dispatch(
                    listCategory({ name: "" })
                ).unwrap();
                break;

            case "company":
                await dispatch(
                    listCompany({ name: "" })
                ).unwrap();
                break;

            case "user":
                await dispatch(
                    listUser({ name: "" })
                ).unwrap();
                break;
        }
    };

    const handleSave = async (
        data: CreationFormValues
    ) => {
        const name = data.name.trim();

        if (!name || !selectedType) return;

        try {
            if (editingItem) {
                // Connect the appropriate update thunk here.
                // Update requires the record ID and form values.
                console.warn(
                    `Update thunk is not configured for ${selectedType}.`
                );
                return;
            }

            switch (selectedType) {
                case "reportMode":
                    await dispatch(
                        createReportMode({ name })
                    ).unwrap();
                    break;

                case "category":
                    // TODO: Dispatch your createCategory thunk.
                    console.warn(
                        "Connect the createCategory thunk."
                    );
                    return;

                case "company":
                    // TODO: Dispatch your createCompany thunk.
                    console.warn(
                        "Connect the createCompany thunk."
                    );
                    return;

                case "user":
                    // TODO: Dispatch your createUser thunk.
                    // User creation may require additional fields.
                    console.warn(
                        "Connect the createUser thunk."
                    );
                    return;
            }

            await refreshSelectedList(selectedType);
            closeModal();
        } catch (error: unknown) {
            console.error("Failed to save record:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!selectedType) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this record?"
        );

        if (!confirmed) return;

        // TODO: Dispatch the corresponding delete thunk.
        // Refresh the list only after successful deletion.
        console.log("Delete record:", {
            type: selectedType,
            id,
        });
    };

    const handleApprove = async (item: any) => {
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

            await refreshSelectedList("user");
        } catch (error: unknown) {
            console.error("Failed to update user status:", error);
        }
    };


    const logOut = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // Clear Redux authentication state
        dispatch(logout());

        // Redirect to login
        navigate("/login", { replace: true });
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <section className="space-y-6">
                <div className="flex justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                            Admin Setup
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Create and manage application resources.
                        </p>
                    </div>

                    <div>
                        <button
                            onClick={() => { logOut() }}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {creationItems.map((item) => {
                        const Icon = item.icon;
                        const isSelected =
                            selectedType === item.type;

                        return (
                            <button
                                key={item.type}
                                type="button"
                                onClick={() =>
                                    setSelectedType(item.type)
                                }
                                aria-pressed={isSelected}
                                className={`group flex min-h-48 w-full flex-col items-start rounded-2xl border bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${isSelected
                                    ? "border-blue-500 ring-2 ring-blue-100"
                                    : "border-slate-200 hover:border-blue-200"
                                    }`}
                            >
                                <div className="flex w-full items-start justify-between">
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor} transition-transform group-hover:scale-110`}
                                    >
                                        <Icon
                                            size={24}
                                            strokeWidth={1.8}
                                        />
                                    </div>

                                    <ArrowUpRight
                                        size={20}
                                        className="text-slate-400 group-hover:text-blue-600"
                                    />
                                </div>

                                <div className="mt-5">
                                    <h3 className="text-base font-semibold text-slate-800">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-5 text-slate-500">
                                        {item.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            {selectedType && (
                <section className="mt-8">
                    {isLoading ? (
                        <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
                            Loading {selectedType} list...
                        </div>
                    ) : hasLoadError ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                            Failed to load {selectedType} list.

                            <button
                                type="button"
                                onClick={() => {
                                    void refreshSelectedList(
                                        selectedType
                                    ).catch((error: unknown) =>
                                        console.error(
                                            "Retry failed:",
                                            error
                                        )
                                    );
                                }}
                                className="ml-2 font-semibold underline"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <CreationList
                            type={selectedType}
                            items={records}
                            onAdd={openAddModal}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                            onApprove={handleApprove}
                        />
                    )}
                </section>
            )}

            {isModalOpen && selectedType && (
                <CreationFormModal
                    type={selectedType}
                    editingItem={editingItem}
                    onClose={closeModal}
                    onSubmit={handleSave}
                />
            )}
        </div>
    );
};

export default CreationCard;
