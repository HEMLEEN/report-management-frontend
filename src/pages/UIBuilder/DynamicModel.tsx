
import { useState } from "react";
import {
    Controller,
    useFieldArray,
    useForm,
} from "react-hook-form";
import Select, { type SingleValue } from "react-select";
import {
    Plus,
    Trash2,
    Eye,
    Code2,
    Download,
} from "lucide-react";

type FieldType = "String" | "Number" | "Boolean" | "Date";

interface ModelField {
    name: string;
    type: FieldType;
    required: boolean;
    unique: boolean;
}

interface ModelFormValues {
    modelName: string;
    fields: ModelField[];
}

interface SelectOption {
    label: string;
    value: FieldType;
}

const fieldTypeOptions: SelectOption[] = [
    { label: "String", value: "String" },
    { label: "Number", value: "Number" },
    { label: "Boolean", value: "Boolean" },
    { label: "Date", value: "Date" },
];

const getTypeScriptType = (type: FieldType): string => {
    switch (type) {
        case "String":
            return "string";
        case "Number":
            return "number";
        case "Boolean":
            return "boolean";
        case "Date":
            return "Date";
    }
};

const getModelNames = (name: string) => {
    const safeName = name.trim();
    const pascalName =
        safeName.charAt(0).toUpperCase() + safeName.slice(1);

    return {
        modelName: pascalName,
        schemaName:
            pascalName.charAt(0).toLowerCase() + pascalName.slice(1),
    };
};

export default function DynamicModelPreview() {
    const [previewMode, setPreviewMode] = useState<
        "form" | "schema"
    >("schema");

    const {
        control,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<ModelFormValues>({
        defaultValues: {
            modelName: "Sample",
            fields: [
                {
                    name: "name",
                    type: "String",
                    required: true,
                    unique: false,
                }
            ],
        },
        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "fields",
    });

    const modelName = watch("modelName");
    const watchedFields = watch("fields") ?? [];

    const { modelName: safeModelName, schemaName } =
        getModelNames(modelName || "Sample");

    const schemaPreview = `import { model, Model, Schema } from "mongoose";

interface ${safeModelName} {
${watchedFields
            .filter((field) => field.name?.trim())
            .map(
                (field) =>
                    `    ${field.name}?: ${getTypeScriptType(field.type)};`,
            )
            .join("\n")}
}

const ${schemaName}Schema = new Schema<${safeModelName}>(
    {
${watchedFields
            .filter((field) => field.name?.trim())
            .map(
                (field) => `        ${field.name}: {
            type: ${field.type},
            required: ${field.required},
            unique: ${field.unique},${field.type === "String"
                        ? `
            uppercase: false,
            trim: true,`
                        : ""
                    }
        },`,
            )
            .join("\n")}
    },
    { timestamps: true }
);

const ${safeModelName}Model: Model<${safeModelName}> = model<${safeModelName}>(
    "${safeModelName}",
    ${schemaName}Schema
);

export default ${safeModelName}Model;`;

    const downloadSchema = () => {
        const validName = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(
            safeModelName,
        );

        if (!validName) {
            return;
        }

        const blob = new Blob([schemaPreview], {
            type: "text/plain;charset=utf-8",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `${safeModelName}.ts`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    };

    const onSubmit = (data: ModelFormValues) => {
        console.log("Model configuration:", data);
        downloadSchema();
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-2xl font-bold text-slate-900">
                    Dynamic Model Builder
                </h1>

                <p className="mb-6 mt-1 text-sm text-slate-500">
                    Configure your Mongoose model and preview the
                    generated TypeScript schema.
                </p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Model Configuration */}
                        <section className="rounded-xl border bg-white p-5 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold">
                                <Code2
                                    className="mr-2 inline"
                                    size={19}
                                />
                                Model Configuration
                            </h2>

                            <label className="mb-2 block text-sm font-medium">
                                Model Name
                            </label>

                            <Controller
                                name="modelName"
                                control={control}
                                rules={{
                                    required: "Model name is required.",
                                    pattern: {
                                        value: /^[A-Za-z_$][A-Za-z0-9_$]*$/,
                                        message:
                                            "Use a valid TypeScript identifier.",
                                    },
                                }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        value={field.value ?? ""}
                                        className="mb-1 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                                        placeholder="Sample"
                                    />
                                )}
                            />

                            {errors.modelName && (
                                <p className="mb-4 text-sm text-red-500">
                                    {errors.modelName.message}
                                </p>
                            )}

                            <div className="mb-3 mt-5 flex items-center justify-between">
                                <h3 className="font-semibold">
                                    Fields
                                </h3>

                                <button
                                    type="button"
                                    onClick={() =>
                                        append({
                                            name: `field${fields.length + 1}`,
                                            type: "String",
                                            required: false,
                                            unique: false,
                                        })
                                    }
                                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                                >
                                    <Plus size={16} />
                                    Add Field
                                </button>
                            </div>

                            <div className="space-y-4">
                                {fields.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="rounded-lg border bg-slate-50 p-3"
                                    >
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div>
                                                <Controller
                                                    name={`fields.${index}.name`}
                                                    control={control}
                                                    rules={{
                                                        required:
                                                            "Field name is required.",
                                                        pattern: {
                                                            value: /^[A-Za-z_$][A-Za-z0-9_$]*$/,
                                                            message:
                                                                "Enter a valid field name.",
                                                        },
                                                        validate: (value) =>
                                                            !watchedFields.some(
                                                                (field, i) =>
                                                                    i !== index &&
                                                                    field.name?.trim().toLowerCase() ===
                                                                    value?.trim().toLowerCase(),
                                                            ) ||
                                                            "Field names must be unique.",
                                                    }}
                                                    render={({ field }) => (
                                                        <input
                                                            {...field}
                                                            value={field.value ?? ""}
                                                            placeholder="Field name"
                                                            className="w-full min-w-0 rounded-md border bg-white p-2"
                                                        />
                                                    )}
                                                />

                                                {errors.fields?.[index]?.name && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors.fields[index]?.name?.message}
                                                    </p>
                                                )}
                                            </div>

                                            <Controller
                                                name={`fields.${index}.type`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Select<SelectOption, false>
                                                        options={fieldTypeOptions}
                                                        value={
                                                            fieldTypeOptions.find(
                                                                (option) =>
                                                                    option.value ===
                                                                    field.value,
                                                            ) ?? fieldTypeOptions[0]
                                                        }
                                                        onChange={(
                                                            option: SingleValue<SelectOption>,
                                                        ) =>
                                                            field.onChange(
                                                                option?.value ?? "String",
                                                            )
                                                        }
                                                        isClearable={false}
                                                        className="text-sm"
                                                        classNamePrefix="react-select"
                                                    />
                                                )}
                                            />

                                            <Controller
                                                name={`fields.${index}.required`}
                                                control={control}
                                                render={({ field }) => (
                                                    <label className="flex items-center gap-2 text-sm">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                        Required
                                                    </label>
                                                )}
                                            />

                                            <Controller
                                                name={`fields.${index}.unique`}
                                                control={control}
                                                render={({ field }) => (
                                                    <label className="flex items-center gap-2 text-sm">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                        Unique
                                                    </label>
                                                )}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="mt-3 flex items-center gap-1 text-sm text-red-600"
                                        >
                                            <Trash2 size={15} />
                                            Remove field
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Live Preview */}
                        <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
                            <div className="border-b p-5">
                                <h2 className="text-lg font-semibold">
                                    <Eye
                                        className="mr-2 inline"
                                        size={19}
                                    />
                                    Live Preview
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Model: {safeModelName || "Untitled"}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPreviewMode("form")
                                        }
                                        className={`rounded-lg px-4 py-2 text-sm ${previewMode === "form"
                                                ? "bg-blue-600 text-white"
                                                : "bg-slate-100 text-slate-700"
                                            }`}
                                    >
                                        Form Preview
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPreviewMode("schema")
                                        }
                                        className={`rounded-lg px-4 py-2 text-sm ${previewMode === "schema"
                                                ? "bg-blue-600 text-white"
                                                : "bg-slate-100 text-slate-700"
                                            }`}
                                    >
                                        Schema Preview
                                    </button>

                                    <button
                                        type="button"
                                        onClick={downloadSchema}
                                        disabled={!!errors.modelName}
                                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Download size={18} />
                                        Download .ts
                                    </button>
                                </div>
                            </div>

                            <div className="p-5">
                                {previewMode === "form" ? (
                                    <div className="space-y-4">
                                        {watchedFields
                                            .filter((field) =>
                                                field.name?.trim(),
                                            )
                                            .map((field, index) => (
                                                <div
                                                    key={`${field.name}-${index}`}
                                                >
                                                    <label className="mb-1 block text-sm font-medium">
                                                        {field.name}
                                                        {field.required && (
                                                            <span className="text-red-500">
                                                                {" "}*
                                                            </span>
                                                        )}
                                                    </label>

                                                    {field.type === "Boolean" ? (
                                                        <input
                                                            type="checkbox"
                                                            className="h-4 w-4"
                                                        />
                                                    ) : (
                                                        <input
                                                            type={
                                                                field.type === "Number"
                                                                    ? "number"
                                                                    : field.type === "Date"
                                                                        ? "date"
                                                                        : field.name.toLowerCase().includes("email")
                                                                            ? "email"
                                                                            : "text"
                                                            }
                                                            required={field.required}
                                                            placeholder={`Enter ${field.name}`}
                                                            className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
                                                        />
                                                    )}

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Type: {field.type}
                                                        {field.unique
                                                            ? " · Unique"
                                                            : ""}
                                                    </p>
                                                </div>
                                            ))}

                                        {watchedFields.length === 0 && (
                                            <p className="text-sm text-slate-400">
                                                Add a field to preview the form.
                                            </p>
                                        )}

                                        <button
                                            type="button"
                                            className="w-full rounded-lg bg-blue-600 py-3 text-white"
                                        >
                                            Preview Submit Button
                                        </button>
                                    </div>
                                ) : (
                                    <pre className="max-h-[650px] overflow-auto rounded-lg bg-slate-950 p-4 text-sm text-green-300">
                                        <code>{schemaPreview}</code>
                                    </pre>
                                )}
                            </div>
                        </section>
                    </div>
                </form>
            </div>
        </div>
    );
}
