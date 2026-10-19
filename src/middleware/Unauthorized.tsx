import { Link } from "react-router-dom";

export default function Unauthorized() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900">
                    Access Denied
                </h1>

                <p className="mt-3 text-sm text-slate-600">
                    You don't have permission to access this page.
                    Contact your administrator if you need access.
                </p>

                <Link
                    to="/workspace"
                    className="mt-6 inline-flex rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}