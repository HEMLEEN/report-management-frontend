import { FormEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { LockKeyhole, Mail, User } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { creatAuthenticate } from "../redux/slices/auth/thunkApi";
import ErrorMessage from "../components/ErrorMessage";
import ErrorModal from "../components/ErrorModal";
import { getRoleHome } from "../middleware/roleNavigation";

type LoginForm = {
  userCode: string;
  password: string;
};

const Login = () => {

  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: "",
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginForm> = async (data: any) => {
    setLoginError(null);

    try {
      const response = await dispatch(
        creatAuthenticate(data)
      ).unwrap();

      if (response.status !== "success") {
        setErrorModal({
          isOpen: true,
          message: "Login failed. Please try again.",
        });
        return;
      }

      const { accessToken, refreshToken, user } = response.data;

      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Get roles returned by your backend
      const roles: string[] = user?.roles ?? [];

      if (roles.length === 0) {
        setErrorModal({
          isOpen: true,
          message: "No roles assigned to this user. Contact your administrator.",
        });
        return;
      }

      // Navigate to the appropriate page
      navigate(getRoleHome(roles), { replace: true });
    } catch (error: unknown) {
      setErrorModal({
        isOpen: true,
        message:
          typeof error === "string"
            ? error
            : "Login failed. Please check your credentials.",
      });
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-brand p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="text-2xl font-bold">RM</div>
        <div>
          <p className="mb-4 text-5xl font-bold leading-tight">
            A smarter way to manage reports.
          </p>
          <p className="max-w-md text-white/70">
            Appointments, clients, teams, schedules and financial operations in
            one workspace.
          </p>
        </div>
        <p className="text-sm text-white/60">© 2026 Report Management</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
          <div className="mb-8">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-brand font-bold text-white">
              RM
            </div>
            <p className="mt-2 text-slate-500">Sign in to continue.</p>
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium">
              User ID
              <div className="mt-1 flex items-center gap-2 rounded-xl border px-3">
                <User size={17} className="text-slate-400" />
                <input
                  type="text"
                  {...register("userCode", {
                    required: "User Id is required",
                  })}
                  className="w-full bg-white px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter User Id"
                />
              </div>
              {errors.userCode && (
                <ErrorMessage message={errors.userCode.message} />
              )}
            </label>
            <label className="block text-sm font-medium">
              Password
              <div className="mt-1 flex items-center gap-2 rounded-xl border px-3">
                <LockKeyhole size={17} className="text-slate-400" />
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    // minLength: {
                    //   value: 6,
                    //   message:
                    //     "Password must be at least 6 characters",
                    // },
                  })}
                  className="w-full bg-white px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter password"
                />
              </div>
              {errors.password && (
                <ErrorMessage message={errors.password.message} />
              )}
            </label>
          </div>
          {/* Forgot Password */}
          <div className="flex justify-between mt-5">
            <NavLink to="/signup" className="text-blue-600 text-sm hover:underline">
              Sign Up
            </NavLink>
            <a
              href="/forgot-password"
              className="text-blue-600 text-sm hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <button
            // disabled={doLogin.isLoading}
            className="mt-6 w-full rounded-xl bg-brand py-3 font-semibold text-white disabled:opacity-60"
          >
            Sign in
            {/* {doLogin.isLoading ? "Signing in..." : "Sign in"} */}
          </button>
          <ErrorModal
            isOpen={errorModal.isOpen}
            message={errorModal.message}
            onClose={() =>
              setErrorModal({ isOpen: false, message: "" })
            }
          />
        </form>
      </div >
    </div >
  );
};

export default Login;
