
import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

interface PaginationProps {
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    loading?: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

const Pagination = ({
    currentPage,
    pageSize,
    totalRecords,
    loading = false,
    onPageChange,
    onPageSizeChange,
}: PaginationProps) => {
    const totalPages = Math.ceil(totalRecords / pageSize);

    const startRecord =
        totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;

    const endRecord = Math.min(
        currentPage * pageSize,
        totalRecords
    );

    const getPageNumbers = (): (number | "...")[] => {
        const pages: (number | "...")[] = [];

        for (let page = 1; page <= totalPages; page++) {
            if (
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
            ) {
                const previous = pages[pages.length - 1];

                if (
                    typeof previous === "number" &&
                    page - previous > 1
                ) {
                    pages.push("...");
                }

                pages.push(page);
            }
        }

        return pages;
    };

    return (
        <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-slate-500">
                    Showing {startRecord} to {endRecord} of{" "}
                    {totalRecords} entries
                </p>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <label htmlFor="pagination-page-size">Show</label>

                    <select
                        id="pagination-page-size"
                        value={pageSize}
                        disabled={loading}
                        onChange={(event) =>
                            onPageSizeChange(Number(event.target.value))
                        }
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-blue-500 disabled:opacity-50"
                    >
                        {[5, 10, 20, 50].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>

                    <span>entries</span>
                </div>
            </div>

            <div className="flex items-center justify-center gap-1">
                <button
                    type="button"
                    aria-label="Previous page"
                    disabled={currentPage <= 1 || loading}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft size={18} />
                </button>

                {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-2 text-slate-400"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            type="button"
                            disabled={loading}
                            aria-label={`Page ${page}`}
                            aria-current={
                                currentPage === page ? "page" : undefined
                            }
                            onClick={() => onPageChange(page)}
                            className={`min-w-9 rounded-lg border px-3 py-2 text-sm font-medium transition ${currentPage === page
                                    ? "border-blue-600 bg-blue-600 text-white"
                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    type="button"
                    aria-label="Next page"
                    disabled={currentPage >= totalPages || loading || totalPages === 0}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
