
import { AlertCircle, X } from "lucide-react";

type ErrorModalProps = {
    isOpen: boolean;
    message: string;
    onClose: () => void;
};

const ErrorModal = ({
    isOpen,
    message,
    onClose,
}: ErrorModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="error-title"
                className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            >
                {/* Close Button */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close error modal"
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Error Icon */}
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                        <AlertCircle size={32} className="text-red-600" />
                    </div>

                    <h2
                        id="error-title"
                        className="text-xl font-bold text-gray-900"
                    >
                        {message || "Something went wrong. Please try again."}
                    </h2>

                    {/* <p className="mt-2 text-sm leading-6 text-gray-600">
                        {message || "Something went wrong. Please try again."}
                    </p> */}

                    {/* OK Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-6 w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
                    >
                        OK, Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;
