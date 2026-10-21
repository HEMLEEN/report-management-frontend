
import { useState } from "react";
import { Building2, Check, Tags, X } from "lucide-react";

export interface AssignReportOption {
    _id: string;
    name: string;
}

export interface AssignReportData {
    type: "category" | "company";
    ids: string[];
}

interface AssignReportModalProps {
    reportModeId: string;
    reportModeName: string;
    categories: AssignReportOption[];
    companies: AssignReportOption[];
    assignedCategoryIds?: string[];
    assignedCompanyIds?: string[];
    loading?: boolean;
    onClose: () => void;
    onSubmit: (data: AssignReportData) => void | Promise<void>;
}

const AssignReportModal = ({
    reportModeId,
    reportModeName,
    categories,
    companies,
    assignedCategoryIds = [],
    assignedCompanyIds = [],
    loading = false,
    onClose,
    onSubmit,
}: AssignReportModalProps) => {
    const [selectedCategories, setSelectedCategories] =
        useState<string[]>(assignedCategoryIds);

    const [selectedCompanies, setSelectedCompanies] =
        useState<string[]>(assignedCompanyIds);

    const [activeTab, setActiveTab] = useState<
        "category" | "company"
    >("category");

    const options =
        activeTab === "category" ? categories : companies;

    const selected =
        activeTab === "category"
            ? selectedCategories
            : selectedCompanies;

    const setSelected =
        activeTab === "category"
            ? setSelectedCategories
            : setSelectedCompanies;

    const toggleSelection = (id: string) => {
        setSelected((previous) =>
            previous.includes(id)
                ? previous.filter((item) => item !== id)
                : [...previous, id]
        );
    };

    const handleSubmit = async () => {
        await onSubmit({
            type: activeTab,
            ids:
                activeTab === "category"
                    ? selectedCategories
                    : selectedCompanies,
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !loading
                ) {
                    onClose();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="assign-report-title"
                className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <div className="flex items-start justify-between border-b border-slate-200 p-5">
                    <div>
                        <h2
                            id="assign-report-title"
                            className="text-lg font-bold text-slate-800"
                        >
                            Assign Category / Company
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Report Mode:{" "}
                            <span className="font-semibold text-slate-700">
                                {reportModeName}
                            </span>
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close modal"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 p-4">
                    <button
                        type="button"
                        onClick={() => setActiveTab("category")}
                        className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${activeTab === "category"
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        <Tags size={17} />
                        Categories
                        <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs">
                            {selectedCategories.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("company")}
                        className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${activeTab === "company"
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        <Building2 size={17} />
                        Companies
                        <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs">
                            {selectedCompanies.length}
                        </span>
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-700">
                            Select{" "}
                            {activeTab === "category"
                                ? "Categories"
                                : "Companies"}
                        </h3>

                        <button
                            type="button"
                            onClick={() =>
                                setSelected(
                                    selected.length === options.length
                                        ? []
                                        : options.map((item) => item._id)
                                )
                            }
                            disabled={loading || options.length === 0}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
                        >
                            {options.length > 0 &&
                                selected.length === options.length
                                ? "Deselect all"
                                : "Select all"}
                        </button>
                    </div>

                    {loading && options.length === 0 ? (
                        <div className="py-10 text-center text-sm text-slate-500">
                            Loading options...
                        </div>
                    ) : options.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center">
                            <p className="font-medium text-slate-700">
                                No{" "}
                                {activeTab === "category"
                                    ? "categories"
                                    : "companies"}{" "}
                                available
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Create them in Setup before assigning.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {options.map((option) => {
                                const isChecked = selected.includes(
                                    option._id
                                );

                                return (
                                    <label
                                        key={option._id}
                                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${isChecked
                                                ? "border-blue-300 bg-blue-50"
                                                : "border-slate-200 hover:bg-slate-50"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            disabled={loading}
                                            onChange={() =>
                                                toggleSelection(option._id)
                                            }
                                            className="h-4 w-4 rounded accent-blue-600"
                                        />

                                        <span className="flex-1 text-sm font-medium text-slate-700">
                                            {option.name}
                                        </span>

                                        {isChecked && (
                                            <Check
                                                size={17}
                                                className="text-blue-600"
                                            />
                                        )}
                                    </label>
                                );
                            })}
                        </div>
                    )}

                    <p className="mt-4 text-xs text-slate-500">
                        Save the selected{" "}
                        {activeTab === "category"
                            ? "categories"
                            : "companies"}{" "}
                        independently. Saving this tab will not call the
                        other assignment API.
                    </p>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-200 p-5">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={() => void handleSubmit()}
                        disabled={loading || !reportModeId}
                        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Saving..."
                            : `Save ${activeTab === "category"
                                ? "Categories"
                                : "Companies"
                            }`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignReportModal;
