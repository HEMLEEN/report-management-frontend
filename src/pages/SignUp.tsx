
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    User,
    LockKeyhole,
    Mail,
    Phone,
    Eye,
    EyeOff,
    UserPlus,
} from "lucide-react";
import { useAppDispatch } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import { creatLogin } from "../redux/slices/auth/thunkApi";
import ErrorMessage from "../components/ErrorMessage";

type SignupFormData = {
    userCode: string;
    password: string;
    name: string;
    mobileNo: string;
};

const SignupForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [loginError, setLoginError] = useState("");
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormData>({
        defaultValues: {
            userCode: "",
            password: "",
            name: "",
            mobileNo: "",
        },
        mode: "onTouched",
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        setLoginError("");
        try {
            const response = await dispatch(creatLogin(data)).unwrap();

            if (response.status == "success") {
                navigate("/login");
            }
            // Navigate only after successful login
        } catch (error) {
            setLoginError(
                typeof error === "string" ? error : "Invalid user ID or password",
            );
        }
    };

    const inputClass = (hasError: boolean) =>
        `w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm
    text-gray-800 outline-none transition
    focus:ring-2 ${hasError
            ? "border-red-500 focus:ring-red-100"
            : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
        }`;

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
                {/* Header */}
                <div className="mb-7 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                        <UserPlus size={28} />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Create Account
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Enter your details to create your account.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* User ID */}
                    <div>
                        <label
                            htmlFor="userId"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            User ID
                        </label>

                        <div className="relative">
                            <User
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <Controller
                                name="userCode"
                                control={control}
                                rules={{
                                    required: "User ID is required",
                                    // minLength: {
                                    //     value: 4,
                                    //     message: "User ID must be at least 4 characters",
                                    // },
                                    // pattern: {
                                    //     value: /^[a-zA-Z0-9_]+$/,
                                    //     message: "Use only letters, numbers, and underscores",
                                    // },
                                }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        id="userCode"
                                        type="text"
                                        autoComplete="username"
                                        placeholder="Enter your user ID"
                                        className={inputClass(!!errors.userCode)}
                                    />
                                )}
                            />
                        </div>

                        {errors.userCode && (
                            <ErrorMessage message={errors.userCode.message} />
                        )}
                    </div>

                    {/* Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            User Name
                        </label>

                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <Controller
                                name="name"
                                control={control}
                                rules={{
                                    required: "Name is required",
                                    // pattern: {
                                    //     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    //     message: "Enter a valid email address",
                                    // },
                                }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        id="name"
                                        type="text"
                                        placeholder="Enter user name."
                                        className={inputClass(!!errors.name)}
                                    />
                                )}
                            />
                        </div>

                        {errors.name && (
                            <ErrorMessage message={errors.name.message} />
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <LockKeyhole
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <Controller
                                name="password"
                                control={control}
                                rules={{
                                    required: "Password is required",
                                    // minLength: {
                                    //     value: 8,
                                    //     message: "Password must be at least 8 characters",
                                    // },
                                    // validate: (value) =>
                                    //     /[A-Za-z]/.test(value) && /\d/.test(value) ||
                                    //     "Include at least one letter and one number",
                                }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="Enter your password"
                                        className={`${inputClass(!!errors.password)} pr-12`}
                                    />
                                )}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {errors.password && (
                            <ErrorMessage message={errors.password.message} />
                        )}
                    </div>



                    {/* Mobile Number */}
                    <div>
                        <label
                            htmlFor="mobileNo"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Mobile Number
                        </label>

                        <div className="relative">
                            <Phone
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <Controller
                                name="mobileNo"
                                control={control}
                                // rules={{
                                //     required: "Mobile number is required",
                                //     pattern: {
                                //         value: /^[6-9]\d{9}$/,
                                //         message: "Enter a valid 10-digit Indian mobile number",
                                //     },
                                // }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        id="mobileNo"
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        autoComplete="tel-national"
                                        placeholder="Enter 10-digit mobile number"
                                        className={inputClass(!!errors.mobileNo)}
                                    />
                                )}
                            />
                        </div>

                        {errors.mobileNo && (
                            <ErrorMessage message={errors.mobileNo.message} />
                        )}
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                            {successMessage}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <UserPlus size={18} />
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                    </button>

                    <p className="text-center text-xs text-gray-500">
                        By signing up, you agree to our Terms & Privacy Policy.
                    </p>
                    <p className="mt-4 text-center text-2xl text-red-400">{loginError}</p>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;
