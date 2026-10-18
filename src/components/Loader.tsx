
interface LoaderProps {
    message?: string;
    fullScreen?: boolean;
}

const Loader = ({
    message = "Preparing your workspace...",
    fullScreen = false,
}: LoaderProps) => {
    return (
        <div
            className={`flex flex-col items-center justify-center bg-white/80 ${fullScreen
                    ? "fixed inset-0 z-50"
                    : "min-h-[300px] w-full"
                }`}
            role="status"
            aria-live="polite"
        >
            <img
                src="/images/rm-meet-greet-loader.gif"
                alt=""
                aria-hidden="true"
                className="h-auto w-64 max-w-full object-contain sm:w-80"
            />

            <p className="mt-3 text-sm font-medium text-slate-600">
                {message}
            </p>
        </div>
    );
};

export default Loader;
