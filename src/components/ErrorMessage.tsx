
type ErrorMessageProps = {
    message?: string;
};

const ErrorMessage = ({ message }: ErrorMessageProps) => {
    if (!message) return null;

    return (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-100 text-[12px]">
                !
            </span>
            {message}
        </p>
    );
};

export default ErrorMessage;
