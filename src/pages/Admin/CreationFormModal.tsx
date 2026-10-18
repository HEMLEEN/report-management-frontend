import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { X } from "lucide-react";
import type {
    CreationFormValues,
    CreationRecord,
    CreationType,
} from "./creation.types";
import { creationLabels } from "./creation.types";

interface CreationFormModalProps {
    type: CreationType;
    editingItem: CreationRecord | null;
    onClose: () => void;
    onSubmit: (data: CreationFormValues) => void;
}

const CreationFormModal = ({
    type,
    editingItem,
    onClose,
    onSubmit,
}: CreationFormModalProps) => {
    const label = creationLabels[type];
    const isEditing = Boolean(editingItem);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreationFormValues>({
        defaultValues: { name: "" },
    });

    useEffect(() => {
        reset({ name: editingItem?.name ?? "" });
    }, [editingItem, type, reset]);

    const submitForm = (data: CreationFormValues) => {
        onSubmit({ name: data.name.trim() });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="creation-modal-title"
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2
                            id="creation-modal-title"
                            className="text-xl font-bold text-slate-800"
                        >
                            {isEditing ? `Edit ${label}` : `Add ${label}`}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Enter the {label.toLowerCase()} name.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(submitForm)} noValidate>
                    <label
                        htmlFor="creation-name"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Name <span className="text-red-500">*</span>
                    </label>

                    <Controller
                        name="name"
                        control={control}
                        rules={{
                            required: "Name is required.",
                            validate: (value) =>
                                value.trim().length > 0 ||
                                "Name cannot contain only spaces.",
                        }}
                        render={({ field }) => (
                            <input
                                {...field}
                                id="creation-name"
                                autoFocus
                                placeholder={`Enter ${label.toLowerCase()} name`}
                                aria-invalid={Boolean(errors.name)}
                                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 ${errors.name
                                        ? "border-red-500 focus:ring-red-100"
                                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                                    }`}
                            />
                        )}
                    />

                    {errors.name && (
                        <p role="alert" className="mt-2 text-sm text-red-600">
                            {errors.name.message}
                        </p>
                    )}

                    <div className="mt-7 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting
                                ? "Saving..."
                                : isEditing
                                    ? "Update"
                                    : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreationFormModal;