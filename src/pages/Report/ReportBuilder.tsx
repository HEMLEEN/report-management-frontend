
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
    Download,
    FileDown,
    FileSpreadsheet,
    Plus,
    RefreshCw,
    Search,
    Upload,
    X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

import ReportBuilderSidebar, {
    type ReportField,
} from "./ReportBuilderSidebar";

import { useAppDispatch } from "../../redux/hooks";
import { listReportBuilder, uploadReport } from "../../redux/slices/report/thunkApi";

interface ReportRow {
    _id?: string;
    id?: string;
    [key: string]: unknown;
}

interface LocationState {
    builder?: ReportRow[];
    reportName?: string;
    category?: string;
    company?: string;
    segment?: string;
}

interface UploadedReport {
    _id: string;
    title: string;
    headers: string[];
    data: ReportRow[];
    createdAt?: string;
    updatedAt?: string;
}

interface UploadReportResponse {
    status?: string;
    code?: number;
    message?: string;
    data?: {
        totalRecords?: number;
        reportList?: UploadedReport[];
        _id?: string;
        title?: string;
        headers?: string[];
        data?: ReportRow[];
        createdAt?: string;
        updatedAt?: string;
    };
}

const getValue = (value: unknown): string => {
    if (value === null || value === undefined) return "";

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
};

const escapeCsv = (value: unknown): string => {
    return `"${getValue(value).replace(/"/g, '""')}"`;
};

const getSafeFilename = (title: string): string =>
    title.trim().replace(/[^a-z0-9_-]/gi, "_") || "report";

const downloadFile = (content: string, filename: string) => {
    const blob = new Blob(["\uFEFF", content], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};


// Extract all reports returned by the API.
const getReportList = (
    result: UploadReportResponse
): UploadedReport[] => {
    const reportList = result.data?.reportList;

    if (Array.isArray(reportList)) {
        return reportList;
    }

    const report = result.data;

    if (
        report &&
        typeof report._id === "string" &&
        typeof report.title === "string" &&
        Array.isArray(report.headers) &&
        Array.isArray(report.data)
    ) {
        return [report as UploadedReport];
    }

    return [];
};

// Combine data from all reports returned by the API.
const getAllReportRows = (
    reports: UploadedReport[]
): ReportRow[] => {
    return reports.flatMap((report) =>
        Array.isArray(report.data) ? report.data : []
    );
};

// Combine headers without duplicates.
const getAllReportHeaders = (
    reports: UploadedReport[]
): string[] => {
    return [
        ...new Set(
            reports.flatMap((report) =>
                Array.isArray(report.headers)
                    ? report.headers.filter(
                        (header) =>
                            header !== "Actions" &&
                            header !== "S.no"
                    )
                    : []
            ),
        ),
    ];
};

const ReportBuilder = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = (location.state ?? {}) as LocationState;

    const builderData = Array.isArray(locationState.builder)
        ? locationState.builder
        : [];

    const [reportTitle, setReportTitle] = useState(
        locationState.reportName ?? "SALES"
    );

    const [salesHeader, setSalesHeader] = useState<string[]>([
        "S.no",
        "Actions",
    ]);

    const [search, setSearch] = useState("");
    const [importedRows, setImportedRows] = useState<ReportRow[]>([]);
    const [hasImportedData, setHasImportedData] = useState(false);

    const [importError, setImportError] = useState("");
    const [importSuccess, setImportSuccess] = useState("");
    const [isImporting, setIsImporting] = useState(false);
    const [generated, setGenerated] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isLoadingReports, setIsLoadingReports] = useState(false);

    // Generate dynamic report headers.
    const handleGenerateHeader = (
        title: string,
        generatedFields: ReportField[]
    ) => {
        const fieldNames = generatedFields
            .map((field) => field.fieldName.trim())
            .filter(Boolean);

        setReportTitle(title);
        setSalesHeader([
            "S.no",
            ...new Set(fieldNames),
            "Actions",
        ]);

        setImportedRows([]);
        setHasImportedData(false);
        setGenerated(true);
        setImportError("");
        setImportSuccess("");
        setSearch("");
    };

    // Keep the currently selected data source.
    const tableRows = useMemo<ReportRow[]>(
        () => (hasImportedData ? importedRows : builderData),
        [hasImportedData, importedRows, builderData]
    );

    // Filter records by the search text.
    const filteredRows = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        if (!searchValue) return tableRows;

        return tableRows.filter((row) =>
            Object.entries(row).some(
                ([key, value]) =>
                    key !== "_id" &&
                    key !== "id" &&
                    getValue(value)
                        .toLowerCase()
                        .includes(searchValue)
            )
        );
    }, [tableRows, search]);

    // Export displayed records as CSV.
    const downloadCsv = () => {
        const exportHeaders = salesHeader.filter(
            (header) => header !== "Actions"
        );

        const csvRows = [
            exportHeaders.map(escapeCsv).join(","),
            ...filteredRows.map((row, index) =>
                exportHeaders
                    .map((header) =>
                        escapeCsv(
                            header === "S.no"
                                ? index + 1
                                : row[header]
                        )
                    )
                    .join(",")
            ),
        ];

        downloadFile(
            csvRows.join("\r\n"),
            `${getSafeFilename(reportTitle)}.csv`
        );
    };

    // Download a real Excel template.
    const downloadTemplate = () => {
        const templateHeaders = [
            "S.no",
            ...salesHeader.filter(
                (header) =>
                    header !== "S.no" && header !== "Actions"
            ),
            "Actions",
        ];

        if (templateHeaders.length <= 2) {
            setImportError(
                "Generate at least one field before downloading a template."
            );
            setImportSuccess("");
            return;
        }

        try {
            const worksheet = XLSX.utils.aoa_to_sheet([
                templateHeaders,
            ]);

            worksheet["!cols"] = templateHeaders.map((header) => ({
                wch: Math.max(header.length + 4, 12),
            }));

            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                "Report Template"
            );

            XLSX.writeFile(
                workbook,
                `${getSafeFilename(reportTitle)}_template.xlsx`
            );

            setImportError("");
            setImportSuccess("Excel template downloaded successfully.");
        } catch (error: unknown) {
            setImportError(
                error instanceof Error
                    ? error.message
                    : "Failed to download the Excel template."
            );
            setImportSuccess("");
        }
    };

    // Upload CSV or Excel and display the returned API data.
    const handleImportCsv = async (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const input = event.currentTarget;
        const file = input.files?.[0];

        if (!file) return;

        setImportError("");
        setImportSuccess("");

        try {
            const allowedExtensions = [".csv", ".xls", ".xlsx"];
            const extension = file.name.includes(".")
                ? file.name
                    .slice(file.name.lastIndexOf("."))
                    .toLowerCase()
                : "";

            if (!allowedExtensions.includes(extension)) {
                throw new Error(
                    "Please select a valid CSV, XLS, or XLSX file."
                );
            }

            const exportHeaders = salesHeader.filter(
                (header) => header !== "Actions"
            );

            if (exportHeaders.length <= 1) {
                throw new Error(
                    "Please generate your report headers before importing a file."
                );
            }

            setIsImporting(true);

            const result = (await dispatch(
                uploadReport({
                    title: file.name,
                    headers: exportHeaders,
                    file,
                })
            ).unwrap()) as UploadReportResponse;

            // Extract all reports through a separate function.
            const reports = getReportList(result);

            if (reports.length === 0) {
                throw new Error(
                    result.message ||
                    "The API did not return any reports."
                );
            }

            // Always display rows from all returned reports.
            const allRows = getAllReportRows(reports);
            const allHeaders = getAllReportHeaders(reports);

            setReportTitle(
                reports.length === 1
                    ? reports[0].title
                    : locationState.reportName ?? "SALES"
            );

            setSalesHeader([
                "S.no",
                ...allHeaders,
                "Actions",
            ]);

            setImportedRows(allRows);
            setHasImportedData(true);
            setGenerated(true);
            setSearch("");

            setImportSuccess(
                `${reports.length} report(s) loaded with ${allRows.length} total record(s).`
            );
        } catch (error: unknown) {
            setImportError(
                error instanceof Error
                    ? error.message
                    : typeof error === "string"
                        ? error
                        : "Failed to import the report."
            );
        } finally {
            setIsImporting(false);
            input.value = "";
        }
    };

    // Clear imported records and return to the builder data.
    const clearImportedData = () => {
        setImportedRows([]);
        setSalesHeader([]),
        setHasImportedData(false);
        setImportError("");
        setImportSuccess("");
        setSearch("");
    };

    const loadReports = async () => {
        try {
            setIsLoadingReports(true);
            setImportError("");

            const result = await dispatch(listReportBuilder({})).unwrap();
            const reports = getReportList(result);

            setImportedRows(getAllReportRows(reports));
            setHasImportedData(true);

            const headers = getAllReportHeaders(reports);

            if (headers.length > 0) {
                setSalesHeader(["S.no", ...headers, "Actions"]);
            }
        } catch (error: unknown) {
            setImportError(
                error instanceof Error
                    ? error.message
                    : "Failed to load reports."
            );
        } finally {
            setIsLoadingReports(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-100 lg:flex-row">
            <ReportBuilderSidebar
                onGenerate={handleGenerateHeader}
            />
          

            <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
                <div className="mb-8 flex flex-col justify-start gap-3 sm:flex-row sm:items-center">

                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        // disabled={!userInitialized || !user?.userCode}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                       Back to Dashboard
                    </button>
                    {/* {workspaceCount > 0 && (<button
                    type="button"
                    onClick={() => navigate("/reportUi")}
                    disabled={!userInitialized || !user?.userCode}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Plus size={16} />
                    Report UI
                </button>)} */}
                </div>
                <div className="mx-auto max-w-[1600px]">
                    {/* Report heading */}
                    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Report Name
                        </p>

                        <h1 className="text-2xl font-bold text-slate-800">
                            {reportTitle}
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            {[
                                locationState.reportName ?? "SALES",
                                locationState.category ?? "DMART",
                                locationState.company,
                                locationState.segment ?? "Residential",
                            ]
                                .filter(Boolean)
                                .join(" | ")}
                        </p>
                    </section>

                    {/* Report table */}
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5">
                            <div className="flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
                                <div>
                                    <h2 className="flex items-center gap-2 font-bold text-slate-800">
                                        <FileSpreadsheet
                                            size={19}
                                            className="text-blue-600"
                                        />
                                        {reportTitle} Report
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {
                                            salesHeader.filter(
                                                (header) =>
                                                    header !== "Actions"
                                            ).length
                                        }{" "}
                                        columns · {filteredRows.length}{" "}
                                        records
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".csv,.xls,.xlsx"
                                        onChange={handleImportCsv}
                                        disabled={isImporting}
                                        className="hidden"
                                    />
                                  

                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        disabled={isImporting}
                                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Upload size={16} />
                                        {isImporting
                                            ? "Importing..."
                                            : "Import CSV / Excel"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={downloadTemplate}
                                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        <FileDown size={16} />
                                        Download Template
                                    </button>

                                    {/* <button
                                        type="button"
                                        onClick={downloadCsv}
                                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                                    >
                                        <Download size={16} />
                                        Export CSV
                                    </button> */}
                                    <button
                                        type="button"
                                        onClick={loadReports}
                                        disabled={isLoadingReports}
                                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                                    >
                                        <RefreshCw size={16} />
                                        {isLoadingReports ? "Loading..." : "Load Old Reports"}
                                    </button>
                                </div>
                            </div>

                            {/* Error message */}
                            {importError && (
                                <div
                                    role="alert"
                                    className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                                >
                                    <span>{importError}</span>

                                    <button
                                        type="button"
                                        onClick={() => setImportError("")}
                                        aria-label="Dismiss error"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            {/* Success message */}
                            {importSuccess && (
                                <div
                                    role="status"
                                    className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
                                >
                                    <span>{importSuccess}</span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setImportSuccess("")
                                        }
                                        aria-label="Dismiss success message"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            {/* Imported data indicator */}
                            {hasImportedData && (
                                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-blue-50 px-3 py-2">
                                    <span className="text-sm text-blue-800">
                                        Showing data from all returned reports
                                    </span>

                                    <button
                                        type="button"
                                        onClick={clearImportedData}
                                        className="text-sm font-semibold text-blue-700 hover:underline"
                                    >
                                        Clear imported data
                                    </button>
                                </div>
                            )}

                            {/* Search */}
                            <div className="relative w-full sm:max-w-xs">
                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search records..."
                                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        {/* Dynamic table */}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max text-left text-sm">
                                <thead className="bg-slate-100 text-slate-700">
                                    <tr>
                                        {salesHeader.map((header) => (
                                            <th
                                                key={header}
                                                className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5 font-semibold"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {filteredRows.length > 0 ? (
                                        filteredRows.map((row, index) => (
                                            <tr
                                                key={
                                                    row._id ??
                                                    row.id ??
                                                    `row-${index}`
                                                }
                                                className="transition hover:bg-slate-50"
                                            >
                                                {salesHeader.map((header) => (
                                                    <td
                                                        key={header}
                                                        className="whitespace-nowrap px-4 py-3.5 text-slate-600"
                                                    >
                                                        {header === "S.no" ? (
                                                            index + 1
                                                        ) : header ===
                                                            "Actions" ? (
                                                            <span className="text-xs text-slate-400">
                                                                —
                                                            </span>
                                                        ) : (
                                                            getValue(row[header])
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={salesHeader.length}
                                                className="px-4 py-14 text-center"
                                            >
                                                <FileSpreadsheet
                                                    size={32}
                                                    className="mx-auto mb-3 text-slate-300"
                                                />

                                                <p className="font-semibold text-slate-700">
                                                    No records found
                                                </p>

                                                <p className="mt-1 text-sm text-slate-400">
                                                    {hasImportedData
                                                        ? "The API returned no rows for the selected reports."
                                                        : "Generate your report headers or import a report to display records."}
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Showing {filteredRows.length} of{" "}
                                {tableRows.length} records
                            </span>

                            <span>
                                {generated
                                    ? "Dynamic headers generated"
                                    : "Default headers loaded"}
                            </span>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default ReportBuilder;
