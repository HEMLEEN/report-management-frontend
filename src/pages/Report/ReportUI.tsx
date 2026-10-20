
import { useState } from "react";
import {
    AlignLeft,
    BarChart3,
    Calendar,
    CheckSquare,
    ChevronDown,
    Eye,
    FileText,
    FormInput,
    GripVertical,
    Heading,
    Image,
    LayoutGrid,
    List,
    Minus,
    MousePointer2,
    Plus,
    Search,
    Settings2,
    Square,
    Trash2,
    Type,
    ArrowUp,
    ArrowDown,
    Download,
} from "lucide-react";

type ComponentType =
    | "heading"
    | "text"
    | "input"
    | "textarea"
    | "select"
    | "date"
    | "checkbox"
    | "button"
    | "card"
    | "stat"
    | "table"
    | "notice"
    | "image"
    | "divider";

interface ReportComponent {
    id: string;
    type: ComponentType;
    label: string;
    content?: string;
    placeholder?: string;
    options?: string;
    required?: boolean;
    variant?: string;
}

const componentLibrary: {
    type: ComponentType;
    label: string;
    description: string;
    icon: typeof FormInput;
    section: "form" | "all";
}[] = [
        { type: "input", label: "Text Input", description: "Single-line field", icon: FormInput, section: "form" },
        { type: "textarea", label: "Textarea", description: "Long-form text", icon: AlignLeft, section: "form" },
        { type: "select", label: "Dropdown", description: "Select an option", icon: ChevronDown, section: "form" },
        { type: "date", label: "Date Picker", description: "Choose a date", icon: Calendar, section: "form" },
        { type: "checkbox", label: "Checkbox", description: "Boolean option", icon: CheckSquare, section: "form" },
        { type: "button", label: "Button", description: "Action button", icon: MousePointer2, section: "form" },
        { type: "heading", label: "Heading", description: "Section heading", icon: Heading, section: "all" },
        { type: "text", label: "Text Block", description: "Supporting content", icon: Type, section: "all" },
        { type: "card", label: "Card", description: "Content container", icon: Square, section: "all" },
        { type: "stat", label: "Statistic", description: "Key metric", icon: BarChart3, section: "all" },
        { type: "table", label: "Data Table", description: "Report records", icon: List, section: "all" },
        { type: "notice", label: "Notice", description: "Information message", icon: FileText, section: "all" },
        { type: "image", label: "Image / Chart", description: "Visual placeholder", icon: Image, section: "all" },
        { type: "divider", label: "Divider", description: "Separate sections", icon: Minus, section: "all" },
    ];

function createComponent(type: ComponentType): ReportComponent {
    const defaults: Record<ComponentType, Omit<ReportComponent, "id" | "type">> = {
        heading: { label: "Section heading", content: "Report Overview" },
        text: { label: "Text Block", content: "Add a description for your report." },
        input: { label: "Full Name", placeholder: "Enter full name" },
        textarea: { label: "Description", placeholder: "Enter description..." },
        select: { label: "Category", placeholder: "Select category", options: "Sales\nMarketing\nFinance" },
        date: { label: "Report Date" },
        checkbox: { label: "Include archived records" },
        button: { label: "Generate Report", variant: "primary" },
        card: { label: "Summary Card", content: "Add related information here." },
        stat: { label: "Total Revenue", content: "₹24,500", variant: "+12% this month" },
        table: {
            label: "Recent Records",
            content: "Report,Status\nSales,Completed\nMarketing,Pending",
        },
        notice: { label: "Information", content: "Configure your report before generating it." },
        image: { label: "Chart Preview", content: "Visual content placeholder" },
        divider: { label: "Divider" },
    };

    return {
        id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type,
        ...defaults[type],
    };
}

const initialComponents = [
    createComponent("heading"),
    createComponent("text"),
    createComponent("select"),
    createComponent("date"),
    createComponent("button"),
];

export default function ReportUI() {
    const [section, setSection] = useState<"form" | "all">("form");
    const [search, setSearch] = useState("");
    const [items, setItems] = useState<ReportComponent[]>(initialComponents);
    const [selectedId, setSelectedId] = useState<string | null>(
        initialComponents[2].id,
    );
    const [preview, setPreview] = useState(false);
    const [reportName, setReportName] = useState("Untitled Report");

    const selected = items.find((item) => item.id === selectedId);

    const library = componentLibrary.filter(
        (item) =>
            (section === "all" || item.section === "form") &&
            `${item.label} ${item.description}`
                .toLowerCase()
                .includes(search.toLowerCase()),
    );

    const addItem = (type: ComponentType) => {
        const item = createComponent(type);
        setItems((current) => [...current, item]);
        setSelectedId(item.id);
        setPreview(false);
    };

    const updateItem = (changes: Partial<ReportComponent>) => {
        if (!selectedId) return;
        setItems((current) =>
            current.map((item) =>
                item.id === selectedId ? { ...item, ...changes } : item,
            ),
        );
    };

    const removeItem = (id: string) => {
        setItems((current) => current.filter((item) => item.id !== id));
        if (selectedId === id) setSelectedId(null);
    };

    const moveItem = (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= items.length) return;

        setItems((current) => {
            const next = [...current];
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });
    };

    const exportLayout = () => {
        const blob = new Blob(
            [JSON.stringify({ name: reportName, components: items }, null, 2)],
            { type: "application/json" },
        );

        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "report-layout.json";
        anchor.click();
        URL.revokeObjectURL(url);
    };

    const renderItem = (item: ReportComponent) => {
        switch (item.type) {
            case "heading":
                return <h2 className="text-xl font-bold text-slate-900">{item.content || item.label}</h2>;

            case "text":
                return <p className="text-sm leading-6 text-slate-500">{item.content}</p>;

            case "input":
                return (
                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-700">
                            {item.label}{item.required ? " *" : ""}
                        </span>
                        <input
                            disabled
                            placeholder={item.placeholder}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                        />
                    </label>
                );

            case "textarea":
                return (
                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-700">{item.label}</span>
                        <textarea
                            disabled
                            placeholder={item.placeholder}
                            rows={3}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                        />
                    </label>
                );

            case "select":
                return (
                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-700">{item.label}</span>
                        <select disabled className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm">
                            <option>{item.placeholder || "Select an option"}</option>
                            {(item.options || "").split("\n").filter(Boolean).map((option) => (
                                <option key={option}>{option}</option>
                            ))}
                        </select>
                    </label>
                );

            case "date":
                return (
                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-700">{item.label}</span>
                        <input disabled type="date" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
                    </label>
                );

            case "checkbox":
                return (
                    <label className="flex items-center gap-3 text-sm text-slate-700">
                        <input disabled type="checkbox" />
                        {item.label}
                    </label>
                );

            case "button":
                return (
                    <button
                        type="button"
                        className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${item.variant === "secondary"
                                ? "border border-slate-200 bg-white text-slate-700"
                                : "bg-indigo-600 text-white"
                            }`}
                    >
                        {item.label}
                    </button>
                );

            case "card":
                return (
                    <div className="rounded-xl border border-slate-200 p-4">
                        <h3 className="font-semibold">{item.label}</h3>
                        <p className="mt-2 text-sm text-slate-500">{item.content}</p>
                    </div>
                );

            case "stat":
                return (
                    <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-sm text-slate-500">{item.label}</p>
                        <h3 className="mt-2 text-2xl font-bold">{item.content}</h3>
                        <p className="mt-1 text-xs text-emerald-600">{item.variant}</p>
                    </div>
                );

            case "table": {
                const rows = (item.content || "")
                    .split("\n")
                    .filter(Boolean)
                    .map((row) => row.split(","));

                return (
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <h3 className="border-b p-3 text-sm font-semibold">{item.label}</h3>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    {(rows[0] || []).map((cell, i) => (
                                        <th key={i} className="px-4 py-3 font-semibold text-slate-600">{cell}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.slice(1).map((row, i) => (
                                    <tr key={i} className="border-t">
                                        {(rows[0] || []).map((_, j) => (
                                            <td key={j} className="px-4 py-3 text-slate-600">{row[j] || "—"}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            }

            case "notice":
                return (
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                        <p className="font-semibold text-indigo-900">{item.label}</p>
                        <p className="mt-1 text-sm text-indigo-800">{item.content}</p>
                    </div>
                );

            case "image":
                return (
                    <div className="flex min-h-36 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-slate-400">
                        <Image size={24} />
                        <p className="mt-2 text-sm font-medium">{item.label}</p>
                        <p className="mt-1 text-xs">{item.content}</p>
                    </div>
                );

            case "divider":
                return <hr className="border-slate-200" />;

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-20 border-b bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
                            <FileText size={22} />
                        </div>
                        <div>
                            <h1 className="font-bold">Report UI Builder</h1>
                            <p className="text-xs text-slate-500">Create custom report layouts</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setPreview(!preview)}
                            className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium hover:bg-slate-50"
                        >
                            <Eye size={16} />
                            {preview ? "Edit layout" : "Preview"}
                        </button>
                        <button
                            type="button"
                            onClick={exportLayout}
                            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                            <Download size={16} />
                            Export
                        </button>
                    </div>
                </div>
            </header>

            {/* Main workspace */}
            <main className="grid grid-cols-1 items-start gap-4 p-3 sm:p-5 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_280px]">

                {/* Left: Component library */}
                {!preview && (
                    <aside className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                        <div className="border-b p-4">
                            <h2 className="font-bold">UI Components</h2>
                            <p className="mt-1 text-xs text-slate-500">Choose components to add</p>

                            <div className="relative mt-4">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search components..."
                                    className="w-full rounded-xl border bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400"
                                />
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
                                <button
                                    type="button"
                                    onClick={() => setSection("form")}
                                    className={`rounded-lg px-2 py-2 text-xs font-semibold ${section === "form" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"
                                        }`}
                                >
                                    <FormInput size={14} className="mr-1 inline" /> Form Section
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSection("all")}
                                    className={`rounded-lg px-2 py-2 text-xs font-semibold ${section === "all" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"
                                        }`}
                                >
                                    <LayoutGrid size={14} className="mr-1 inline" /> All UI
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 p-3">
                            {library.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.type}
                                        type="button"
                                        onClick={() => addItem(item.type)}
                                        className="group rounded-xl border p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
                                    >
                                        <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700">
                                            <Icon size={18} />
                                        </span>
                                        <span className="block text-xs font-semibold">{item.label}</span>
                                        <span className="mt-1 block text-[10px] leading-4 text-slate-400">{item.description}</span>
                                    </button>
                                );
                            })}
                            {library.length === 0 && (
                                <p className="col-span-2 p-4 text-center text-sm text-slate-400">No components found.</p>
                            )}
                        </div>
                    </aside>
                )}

                {/* Center: Report canvas */}
                <section className="min-w-0">
                    <div className="mb-4">
                        <p className="text-xs text-slate-400">Workspace / {preview ? "Preview" : "Editor"}</p>
                        <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                            {preview ? "Report Preview" : "Build your report"}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {preview ? "Review the report layout." : "Select any component to customize its properties."}
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                        <div className="border-b p-4 sm:p-5">
                            <input
                                aria-label="Report name"
                                value={reportName}
                                onChange={(event) => setReportName(event.target.value)}
                                disabled={preview}
                                className="w-full bg-transparent text-lg font-bold outline-none disabled:text-slate-800"
                            />
                            <p className="mt-1 text-xs text-slate-400">Report layout · {items.length} components</p>
                        </div>

                        <div className="min-h-[500px] space-y-3 bg-slate-50 p-3 sm:p-6">
                            {items.length === 0 ? (
                                <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white p-6 text-center">
                                    <LayoutGrid size={32} className="text-indigo-500" />
                                    <h3 className="mt-4 font-semibold">Your canvas is empty</h3>
                                    <p className="mt-2 text-sm text-slate-500">Select a component from the library to begin.</p>
                                </div>
                            ) : (
                                items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        onClick={() => !preview && setSelectedId(item.id)}
                                        className={`group relative rounded-xl bg-white transition ${!preview && selectedId === item.id
                                                ? "ring-2 ring-indigo-500 ring-offset-1"
                                                : !preview
                                                    ? "hover:ring-1 hover:ring-slate-300"
                                                    : ""
                                            }`}
                                    >
                                        {!preview && (
                                            <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-lg border bg-white p-1 opacity-0 shadow-sm group-hover:opacity-100">
                                                <button
                                                    type="button"
                                                    aria-label="Move up"
                                                    disabled={index === 0}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        moveItem(index, -1);
                                                    }}
                                                    className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                                                >
                                                    <ArrowUp size={13} />
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-label="Move down"
                                                    disabled={index === items.length - 1}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        moveItem(index, 1);
                                                    }}
                                                    className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                                                >
                                                    <ArrowDown size={13} />
                                                </button>
                                                <GripVertical size={13} className="text-slate-300" />
                                                <button
                                                    type="button"
                                                    aria-label="Delete component"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        removeItem(item.id);
                                                    }}
                                                    className="rounded p-1 text-rose-500 hover:bg-rose-50"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        )}
                                        <div className="p-4 sm:p-5">{renderItem(item)}</div>
                                    </div>
                                ))
                            )}

                            {!preview && items.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => addItem("input")}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-4 text-sm font-medium text-slate-500 hover:border-indigo-300 hover:text-indigo-700"
                                >
                                    <Plus size={16} /> Add component
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Right: Properties */}
                {!preview && (
                    <aside className="overflow-hidden rounded-2xl border bg-white shadow-sm xl:sticky xl:top-24">
                        <div className="flex items-center justify-between border-b p-4">
                            <div>
                                <h2 className="font-bold">Properties</h2>
                                <p className="mt-1 text-xs text-slate-500">Configure selected item</p>
                            </div>
                            <Settings2 size={18} className="text-slate-400" />
                        </div>

                        {!selected ? (
                            <p className="p-6 text-center text-sm text-slate-400">
                                Select a component on the canvas to edit it.
                            </p>
                        ) : (
                            <div className="space-y-5 p-4">
                                <div>
                                    <label className="mb-2 block text-xs font-semibold text-slate-600">Component type</label>
                                    <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm capitalize">{selected.type}</div>
                                </div>

                                <div>
                                    <label htmlFor="component-label" className="mb-2 block text-xs font-semibold text-slate-600">Label / Title</label>
                                    <input
                                        id="component-label"
                                        value={selected.label}
                                        onChange={(event) => updateItem({ label: event.target.value })}
                                        className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                    />
                                </div>

                                {["heading", "text", "card", "stat", "table", "notice", "image"].includes(selected.type) && (
                                    <div>
                                        <label htmlFor="component-content" className="mb-2 block text-xs font-semibold text-slate-600">Content</label>
                                        <textarea
                                            id="component-content"
                                            rows={selected.type === "table" ? 5 : 3}
                                            value={selected.content || ""}
                                            onChange={(event) => updateItem({ content: event.target.value })}
                                            className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        />
                                        {selected.type === "table" && (
                                            <p className="mt-1 text-xs text-slate-400">Use commas between columns and new lines between rows.</p>
                                        )}
                                    </div>
                                )}

                                {["input", "textarea", "select"].includes(selected.type) && (
                                    <div>
                                        <label htmlFor="component-placeholder" className="mb-2 block text-xs font-semibold text-slate-600">Placeholder</label>
                                        <input
                                            id="component-placeholder"
                                            value={selected.placeholder || ""}
                                            onChange={(event) => updateItem({ placeholder: event.target.value })}
                                            className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        />
                                    </div>
                                )}

                                {selected.type === "select" && (
                                    <div>
                                        <label htmlFor="component-options" className="mb-2 block text-xs font-semibold text-slate-600">Dropdown options</label>
                                        <textarea
                                            id="component-options"
                                            rows={4}
                                            value={selected.options || ""}
                                            onChange={(event) => updateItem({ options: event.target.value })}
                                            className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        />
                                        <p className="mt-1 text-xs text-slate-400">Enter one option per line.</p>
                                    </div>
                                )}

                                {selected.type === "input" && (
                                    <label className="flex items-center justify-between rounded-xl border p-3">
                                        <span className="text-sm">Required field</span>
                                        <input
                                            type="checkbox"
                                            checked={Boolean(selected.required)}
                                            onChange={(event) => updateItem({ required: event.target.checked })}
                                            className="h-4 w-4 accent-indigo-600"
                                        />
                                    </label>
                                )}

                                {selected.type === "button" && (
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold text-slate-600">Button style</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {["primary", "secondary"].map((variant) => (
                                                <button
                                                    key={variant}
                                                    type="button"
                                                    onClick={() => updateItem({ variant })}
                                                    className={`rounded-xl border px-3 py-2 text-xs font-semibold capitalize ${(selected.variant || "primary") === variant
                                                            ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                                                            : "text-slate-500"
                                                        }`}
                                                >
                                                    {variant}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selected.type === "stat" && (
                                    <div>
                                        <label htmlFor="component-variant" className="mb-2 block text-xs font-semibold text-slate-600">Trend text</label>
                                        <input
                                            id="component-variant"
                                            value={selected.variant || ""}
                                            onChange={(event) => updateItem({ variant: event.target.value })}
                                            className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                        />
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => removeItem(selected.id)}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                                >
                                    <Trash2 size={15} /> Remove component
                                </button>
                            </div>
                        )}
                    </aside>
                )}
            </main>
        </div>
    );
}
