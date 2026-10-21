import { ReportComponent } from "./ReportUI";

export const jsxText = (value: string | undefined) =>
    `{${JSON.stringify(value ?? "")}}`;

export function generateComponentCode(item: ReportComponent): string {
    const label = jsxText(item.label);
    const content = jsxText(item.content);
    const placeholder = jsxText(item.placeholder);

    switch (item.type) {
        case "heading":
            return `<h2 className="text-xl font-bold text-slate-900">${jsxText(item.content || item.label)}</h2>`;

        case "text":
            return `<p className="text-sm leading-6 text-slate-500">${content}</p>`;

        case "input":
            return `
<label className="block space-y-2">
    <span className="text-sm font-medium">${label}${item.required ? ' + "*" ' : ""}</span>
    <input type="text" placeholder={${JSON.stringify(item.placeholder || "")}} ${item.required ? "required" : ""} className="w-full rounded-xl border px-3 py-2.5" />
</label>`;

        case "textarea":
            return `
<label className="block space-y-2">
    <span className="text-sm font-medium">${label}</span>
    <textarea placeholder={${JSON.stringify(item.placeholder || "")}} className="w-full rounded-xl border px-3 py-2.5" rows={3} />
</label>`;

        case "select": {
            const options = (item.options || "")
                .split("\n")
                .filter(Boolean)
                .map(
                    (option) =>
                        `<option value={${JSON.stringify(option)}}>${jsxText(option)}</option>`,
                )
                .join("\n");

            return `
<label className="block space-y-2">
    <span className="text-sm font-medium">${label}</span>
    <select defaultValue="" className="w-full rounded-xl border bg-white px-3 py-2.5">
        <option value="" disabled>${jsxText(item.placeholder || "Select an option")}</option>
        ${options}
    </select>
</label>`;
        }

        case "date":
            return `
<label className="block space-y-2">
    <span className="text-sm font-medium">${label}</span>
    <input type="date" className="w-full rounded-xl border px-3 py-2.5" />
</label>`;

        case "checkbox":
            return `
<label className="flex items-center gap-3 text-sm">
    <input type="checkbox" />
    ${label}
</label>`;

        case "button":
            return `
<button type="button" className="rounded-xl ${item.variant === "secondary"
                    ? "border bg-white text-slate-700"
                    : "bg-indigo-600 text-white"
                } px-4 py-2.5 font-semibold">
    ${label}
</button>`;

        case "card":
            return `
<div className="rounded-xl border p-4">
    <h3 className="font-semibold">${label}</h3>
    <p className="mt-2 text-sm text-slate-500">${content}</p>
</div>`;

        case "stat":
            return `
<div className="rounded-xl border p-4">
    <p className="text-sm text-slate-500">${label}</p>
    <h3 className="mt-2 text-2xl font-bold">${content}</h3>
    <p className="mt-1 text-xs text-emerald-600">${jsxText(item.variant)}</p>
</div>`;

        case "table": {
            const rows = (item.content || "")
                .split("\n")
                .filter(Boolean)
                .map((row) => row.split(","));

            const headers = rows[0] || [];

            return `
<div className="overflow-x-auto rounded-xl border">
    <h3 className="border-b p-3 font-semibold">${label}</h3>
    <table className="w-full text-left text-sm">
        <thead className="bg-slate-50">
            <tr>
                ${headers.map((cell) => `<th className="px-4 py-3">${jsxText(cell)}</th>`).join("\n")}
            </tr>
        </thead>
        <tbody>
            ${rows.slice(1).map((row) => `
            <tr className="border-t">
                ${headers.map((_, index) => `<td className="px-4 py-3">${jsxText(row[index] || "—")}</td>`).join("\n")}
            </tr>`).join("\n")}
        </tbody>
    </table>
</div>`;
        }

        case "notice":
            return `
<div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
    <h3 className="font-semibold text-indigo-900">${label}</h3>
    <p className="mt-1 text-sm text-indigo-800">${content}</p>
</div>`;

        case "image":
            return `
<div className="flex min-h-36 flex-col items-center justify-center rounded-xl border-2 border-dashed p-5">
    <p className="font-semibold">${label}</p>
    <p className="mt-1 text-sm text-slate-500">${content}</p>
</div>`;

        case "divider":
            return `<hr className="border-slate-200" />`;

        default:
            return "";
    }
}
