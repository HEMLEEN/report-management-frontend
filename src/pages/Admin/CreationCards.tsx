
import { useEffect, useState } from "react";
import {
    UserPlus,
    FilePlus2,
    Tags,
    Building2,
    ArrowUpRight,
} from "lucide-react";

import CreationList from "./CreationList";
import CreationFormModal from "./CreationFormModal";

import type {
    CreationFormValues,
    CreationRecord,
    CreationType,
} from "./creation.types";

import {
    createReportMode,
    listCategory,
    listCompany,
    listReportMode,
} from "../../redux/slices/setup/thunkApi";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

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

const normalizeRecords = (items: ApiRecord[] = []): CreationRecord[] =>
    items.map((item) => ({
        id: item._id ?? item.id ?? "",
        name: item.name,
    }));

const CreationCard = () => {
    const dispatch = useAppDispatch();

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

    // Load only the list belonging to the selected card.
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
                // Dispatch your user-list thunk here.
                break;
        }
    }, [dispatch, selectedType]);

    // Derive the displayed list directly from Redux.
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
            default:
                return [];
        }
    })();

    const isLoading =
        selectedType === "reportMode"
            ? isReportModeLoading.list
            : selectedType === "category"
                ? isCategoryLoading.list
                : selectedType === "company"
                    ? isCompanyLoading.list
                    : false;

    const loadError =
        selectedType === "reportMode"
            ? reportModeError
            : selectedType === "category"
                ? categoryError
                : selectedType === "company"
                    ? companyError
                    : null;

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

    const refreshSelectedList = async (type: CreationType) => {
        switch (type) {
            case "reportMode":
                await dispatch(listReportMode({ name: "" })).unwrap();
                break;

            case "category":
                await dispatch(listCategory({ name: "" })).unwrap();
                break;

            case "company":
                await dispatch(listCompany({ name: "" })).unwrap();
                break;

            case "user":
                // Dispatch your user-list thunk here.
                break;
        }
    };

    const handleSave = async (data: CreationFormValues) => {
        const name = data.name.trim();

        if (!name || !selectedType) return;

        try {
            if (selectedType === "reportMode") {
                if (editingItem) {
                    // Replace with your updateReportMode thunk.
                    console.warn("Connect the report mode update thunk.");
                    return;
                }

                await dispatch(createReportMode({ name })).unwrap();
            } else if (selectedType === "category") {
                // Dispatch your createCategory thunk here.
                console.warn("Connect the category creation thunk.");
                return;
            } else if (selectedType === "company") {
                // Dispatch your createCompany thunk here.
                console.warn("Connect the company creation thunk.");
                return;
            } else {
                // Dispatch your createUser thunk here.
                console.warn("Connect the user creation thunk.");
                return;
            }

            await refreshSelectedList(selectedType);
            closeModal();
        } catch (error) {
            console.error("Failed to save record:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!selectedType) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this record?"
        );

        if (!confirmed) return;

        // Dispatch the corresponding delete thunk here.
        // Do not remove Redux records locally before the API succeeds.
        console.log("Delete record:", { type: selectedType, id });
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                        Admin Setup
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Create and manage application resources.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {creationItems.map((item) => {
                        const Icon = item.icon;
                        const isSelected = selectedType === item.type;

                        return (
                            <button
                                key={item.type}
                                type="button"
                                onClick={() => setSelectedType(item.type)}
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
                                        <Icon size={24} strokeWidth={1.8} />
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
                <>
                    {isLoading ? (
                        <div className="mt-8 rounded-xl border bg-white p-10 text-center text-slate-500">
                            Loading {selectedType} list...
                        </div>
                    ) : loadError ? (
                        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                            Failed to load {selectedType} list.
                            <button
                                type="button"
                                onClick={() => {
                                    void refreshSelectedList(selectedType).catch(
                                        (error) =>
                                            console.error("Retry failed:", error)
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
                        />
                    )}
                </>
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
