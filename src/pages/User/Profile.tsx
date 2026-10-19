
import { useEffect } from "react";
import {
    UserRound,
    ShieldCheck,
    CalendarDays,
    Clock,
    IdCard,
    RefreshCw,
    Mail,
    ArrowLeft,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { profileUser } from "../../redux/slices/user/thunkApi";
import { UserStatus } from "../../enum/Enum";

const Profile = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const location = useLocation();

    const user = location.state?.user;
    const userCode = user?.userCode;
    const { userDetails, isUserLoading, profileError } = useAppSelector(
        (state) => state.profile
    );

    useEffect(() => {
        if (userCode) {
            dispatch(profileUser({ userCode }));
        }
    }, [dispatch, userDetails]);

    const formatDate = (date?: string) => {
        if (!date) return "Not available";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const isActive = userDetails?.status === UserStatus.ACTIVE;

    if (isUserLoading.detail && !userDetails) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
                    <p className="text-sm text-gray-500">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (profileError && !userDetails) {
        return (
            <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
                <p className="font-semibold text-red-600">
                    Failed to load profile
                </p>
                <p className="mt-2 text-sm text-gray-500">{profileError}</p>
                <button
                    onClick={() => dispatch(profileUser(userCode))}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                    <RefreshCw size={16} />
                    Try again
                </button>
            </div>
        );
    }

    if (!userDetails) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-brand"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>

                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            My Profile
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            View your account information and access details.
                        </p>
                    </div>

                    <button
                        onClick={() => dispatch(profileUser(userCode))}
                        disabled={isUserLoading.detail}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={isUserLoading.detail ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>

                {/* Profile Card */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {/* Banner */}
                    <div className="h-32 bg-gradient-to-r from-brand/90 via-brand to-indigo-500 sm:h-40" />

                    {/* User Information */}
                    <div className="px-5 pb-6 sm:px-8">
                        <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex items-end gap-4">
                                <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl border-4 border-white bg-brand/10 text-3xl font-bold text-black shadow-sm sm:h-28 sm:w-28">
                                    {userDetails.name?.charAt(0).toUpperCase() || (
                                        <UserRound size={40} />
                                    )}
                                </div>

                                <div className="pb-1">
                                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                        {userDetails.name}
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        User ID: {userDetails.userCode}
                                    </p>
                                </div>
                            </div>

                            <span
                                className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${isActive
                                    ? "bg-green-50 text-green-700"
                                    : "bg-amber-50 text-amber-700"
                                    }`}
                            >
                                <span
                                    className={`h-2 w-2 rounded-full ${isActive ? "bg-green-500" : "bg-amber-500"
                                        }`}
                                />
                                {isActive ? "Active Account" : "Inactive Account"}
                            </span>
                        </div>

                        <div className="my-7 border-t border-gray-100" />

                        {/* Account Details */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                Account Information
                            </h3>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <InfoCard
                                    icon={<IdCard size={19} />}
                                    label="User ID"
                                    value={userDetails.userCode}
                                />

                                <InfoCard
                                    icon={<UserRound size={19} />}
                                    label="Full Name"
                                    value={userDetails.name}
                                />

                                <InfoCard
                                    icon={<ShieldCheck size={19} />}
                                    label="Account Status"
                                    value={isActive ? "Active" : userDetails.status}
                                />

                                <InfoCard
                                    icon={<CalendarDays size={19} />}
                                    label="Account Created"
                                    value={formatDate(userDetails.createdAt)}
                                />

                                <InfoCard
                                    icon={<Clock size={19} />}
                                    label="Last Updated"
                                    value={formatDate(userDetails.updatedAt)}
                                />
                            </div>
                        </div>

                        {/* Roles */}
                        <div className="mt-8">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                Assigned Roles
                            </h3>

                            <div className="flex flex-wrap gap-2">
                                {userDetails.roles?.length ? (
                                    userDetails.roles.map((role) => (
                                        <span
                                            key={role}
                                            className="inline-flex items-center gap-2 rounded-lg border border-brand/20 bg-brand/5 px-3 py-2 text-sm font-semibold text-brand"
                                        >
                                            <ShieldCheck size={15} />
                                            {role}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        No roles assigned.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-5 flex items-center gap-2 text-xs text-gray-400">
                    <ShieldCheck size={15} />
                    Your account information is managed by the system administrator.
                </div>
            </div>
        </div>
    );
};

interface InfoCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

const InfoCard = ({ icon, label, value }: InfoCardProps) => {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-4 transition hover:border-brand/20 hover:bg-brand/[0.02]">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                {icon}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {label}
                </p>
                <p className="mt-1 break-words text-sm font-semibold text-gray-900">
                    {value || "Not available"}
                </p>
            </div>
        </div>
    );
};

export default Profile;
