
import { Plus, Trash2, WandSparkles } from "lucide-react";
import { useState } from "react";

export interface ReportField {
    id: string;
    fieldName: string;
}

interface ReportBuilderSidebarProps {
    onGenerate: (title: string, fields: ReportField[]) => void;
}

const createField = (): ReportField => ({
    id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    fieldName: "",
});

const ReportBuilderSidebar = ({
    onGenerate,
}: ReportBuilderSidebarProps) => {
    const [title, setTitle] = useState("");
    const [fields, setFields] = useState<ReportField[]>([
        { id: "field-1", fieldName: "" },
    ]);
    const [error, setError] = useState("");

    const addField = () => {
        setFields((previous) => [...previous, createField()]);
        setError("");
    };

    const updateField = (id: string, fieldName: string) => {
        setFields((previous) =>
            previous.map((field) =>
                field.id === id ? { ...field, fieldName } : field
            )
        );
        setError("");
    };

    const removeField = (id: string) => {
        setFields((previous) =>
            previous.filter((field) => field.id !== id)
        );
        setError("");
    };

    const generateHeader = () => {
        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            setError("Please enter a Label / Title.");
            return;
        }

        const cleanedFields = fields.map((field) => ({
            ...field,
            fieldName: field.fieldName.trim(),
        }));

        if (cleanedFields.some((field) => !field.fieldName)) {
            setError("Please fill in all field names or remove empty fields.");
            return;
        }

        if (cleanedFields.length === 0) {
            setError("Please add at least one field name.");
            return;
        }

        const normalizedNames = cleanedFields.map((field) =>
            field.fieldName.toLowerCase()
        );

        if (new Set(normalizedNames).size !== normalizedNames.length) {
            setError("Field names must be unique.");
            return;
        }

        if (
            cleanedFields.some((field) =>
                ["s.no", "actions"].includes(
                    field.fieldName.toLowerCase()
                )
            )
        ) {
            setError('"S.no" and "Actions" are reserved column names.');
            return;
        }

        onGenerate(trimmedTitle, cleanedFields);
        setError("");
    };

    return (
        <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-white lg:w-80 lg:shrink-0">
            <div className="border-b border-slate-200 px-5 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <WandSparkles size={21} />
                    </div>

                    <div>
                        <h2 className="text-base font-bold text-slate-800">
                            Dynamic Header
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Create your report columns
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-5">
                <div>
                    <label
                        htmlFor="report-title"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Label / Title
                    </label>

                    <input
                        id="report-title"
                        type="text"
                        value={title}
                        onChange={(event) => {
                            setTitle(event.target.value);
                            setError("");
                        }}
                        placeholder="Example: SALES"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <p className="mt-1.5 text-xs text-slate-400">
                        Enter the report title.
                    </p>
                </div>

                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <label className="text-sm font-semibold text-slate-700">
                            Field Names
                        </label>

                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                            {fields.length} fields
                        </span>
                    </div>

                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor={field.id}
                                        className="text-xs font-semibold text-slate-600"
                                    >
                                        Field {index + 1}
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => removeField(field.id)}
                                        title="Remove field"
                                        aria-label={`Remove field ${index + 1}`}
                                        className="rounded-md p-1.5 text-red-500 transition hover:bg-red-50"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>

                                <input
                                    id={field.id}
                                    type="text"
                                    value={field.fieldName}
                                    onChange={(event) =>
                                        updateField(
                                            field.id,
                                            event.target.value
                                        )
                                    }
                                    placeholder={
                                        index === 0
                                            ? "Invoice Date"
                                            : `Field ${index + 1}`
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addField}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-blue-300 px-3 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                        <Plus size={17} />
                        Add Field
                    </button>
                </div>

                {error && (
                    <p
                        role="alert"
                        className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
                    >
                        {error}
                    </p>
                )}
            </div>

            <div className="border-t border-slate-200 p-5">
                <button
                    type="button"
                    onClick={generateHeader}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    <WandSparkles size={17} />
                    Generate Header
                </button>

                <p className="mt-2 text-center text-xs text-slate-400">
                    S.no and Actions are added automatically.
                </p>
            </div>
        </aside>
    );
};

export default ReportBuilderSidebar;
