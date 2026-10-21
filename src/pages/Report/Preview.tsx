import type { FC } from "react";

interface ReportProps { }

const reportTitle = "Sale Repot";

const PreviewUIComponent = () => {
    return (
        <main className="min-h-screen bg-slate-100 p-4 sm:p-8">
            <div className="mx-auto max-w-5xl rounded-2xl bg-white p-5 shadow-sm sm:p-8">
                <header className="mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-slate-900">
                        {reportTitle}
                    </h1>
                </header>

                <div className="space-y-5">
                    <h2 className="text-xl font-bold text-slate-900">{"Report Overview"}</h2>
                    <p className="text-sm leading-6 text-slate-500">{"Add a description for your report."}</p>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium">{"Category"}</span>
                        <select defaultValue="" className="w-full rounded-xl border bg-white px-3 py-2.5">
                            <option value="" disabled>{"Select category"}</option>
                            <option value={"Sales"}>{"Sales"}</option>
                            <option value={"Marketing"}>{"Marketing"}</option>
                            <option value={"Finance"}>{"Finance"}</option>
                        </select>
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium">{"Report Date"}</span>
                        <input type="date" className="w-full rounded-xl border px-3 py-2.5" />
                    </label>

                    <button type="button" className="rounded-xl bg-indigo-600 text-white px-4 py-2.5 font-semibold">
                        {"Generate Report"}
                    </button>
                </div>
            </div>
        </main>
    );
};
export default PreviewUIComponent;
