import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { ShieldCheck, X } from "lucide-react";
import type { MultiValue } from "react-select";
import { UserRoles, type UserRole } from "../../../enum/Enum";

interface AssignRoleFormValues {
    roles: UserRole[];
}

interface AssignRoleModalProps {
    userName?: string;
    currentRoles?: UserRole[];
    onClose: () => void;
    onSubmit: (data: AssignRoleFormValues) => void | Promise<void>;
}

interface RoleOption {
    value: UserRole;
    label: string;
}

const roleOptions: RoleOption[] = [
    { value: UserRoles.SA, label: "Super Admin (SA)" },
    { value: UserRoles.ASC, label: "Admin / Setup Access (ASC)" },
    { value: UserRoles.ADMIN, label: "Admin (A)" },
    { value: UserRoles.HR, label: "Human Resources (HR)" },
    { value: UserRoles.USER, label: "User (USER)" },
];


const AssignRoleModal = ({
    userName,
    currentRoles = [],
    onClose,
    onSubmit,
}: AssignRoleModalProps) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AssignRoleFormValues>({
        defaultValues: {
            roles: currentRoles,
        },
    });

    useEffect(() => {
        reset({ roles: currentRoles });
    }, [currentRoles, reset]);

    const submitForm = async (data: AssignRoleFormValues) => {
        await onSubmit({
            roles: data.roles,
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center
            bg-black/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="assign-role-title"
                className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            >
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                            <ShieldCheck size={24} />
                        </div>

                        <div>
                            <h2
                                id="assign-role-title"
                                className="text-xl font-bold text-slate-800"
                            >
                                Assign Roles
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {userName
                                    ? `Manage roles for ${userName}.`
                                    : "Select roles to assign to this user."}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="rounded-lg p-2 text-slate-500
                        transition hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(submitForm)}
                    noValidate
                >
                    <label
                        htmlFor="assign-roles"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Select Roles <span className="text-red-500">*</span>
                    </label>

                    <Controller
                        name="roles"
                        control={control}
                        rules={{
                            validate: (value) =>
                                value.length > 0 ||
                                "Please select at least one role.",
                        }}
                        render={({ field }) => (
                            <Select
                                inputId="assign-roles"
                                name={field.name}
                                ref={field.ref}
                                options={roleOptions}
                                isMulti
                                isClearable
                                closeMenuOnSelect={false}
                                placeholder="Choose one or more roles..."
                                value={roleOptions.filter((option) =>
                                    field.value.includes(option.value)
                                )}
                                onChange={(
                                    selected: MultiValue<(typeof roleOptions)[number]>
                                ) => {
                                    field.onChange(
                                        selected.map((option) => option.value)
                                    );
                                }}
                                onBlur={field.onBlur}
                                classNamePrefix="role-select"
                                aria-invalid={Boolean(errors.roles)}
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        minHeight: "46px",
                                        borderRadius: "12px",
                                        borderColor: errors.roles
                                            ? "#ef4444"
                                            : state.isFocused
                                                ? "#3b82f6"
                                                : "#cbd5e1",
                                        boxShadow: state.isFocused
                                            ? "0 0 0 2px #dbeafe"
                                            : "none",
                                        "&:hover": {
                                            borderColor: "#3b82f6",
                                        },
                                    }),
                                    multiValue: (base) => ({
                                        ...base,
                                        backgroundColor: "#dbeafe",
                                        borderRadius: "6px",
                                    }),
                                    multiValueLabel: (base) => ({
                                        ...base,
                                        color: "#1d4ed8",
                                        fontWeight: 600,
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        zIndex: 60,
                                    }),
                                }}
                            />
                        )}
                    />

                    {errors.roles && (
                        <p
                            role="alert"
                            className="mt-2 text-sm text-red-600"
                        >
                            {errors.roles.message}
                        </p>
                    )}

                    <p className="mt-2 text-xs text-slate-500">
                        You can assign multiple roles to a single user.
                    </p>

                    {/* Actions */}
                    <div className="mt-7 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-300
                            px-5 py-2.5 text-sm font-semibold
                            text-slate-700 transition hover:bg-slate-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl bg-blue-600 px-5 py-2.5
                            text-sm font-semibold text-white transition
                            hover:bg-blue-700 disabled:cursor-not-allowed
                            disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : "Assign Roles"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignRoleModal;