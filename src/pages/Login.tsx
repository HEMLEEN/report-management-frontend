import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../services/api";
import { useAppDispatch } from "../hooks";
import { login } from "../features/authSlice";
import { LockKeyhole, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";

type LoginForm = {
  userCode: string;
  password: string;
};

const Login = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [doLogin, { isLoading, error }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      //  setLoading(true);
      //  setIsLoggedIn(true);
      navigate("/setup");

      // const response = await axios.post("http://localhost:8140/auth/login", data);

      // localStorage.setItem(
      //     "accessToken",
      //     response.data.accessToken
      // );

      // localStorage.setItem(
      //     "user",
      //     JSON.stringify(response.data)
      // );

      // const user = {
      //     userCode: "admin",
      //     password: "admin123",
      //     role: "Admin",
      // }

      // switch (user.role) {
      //     case "Admin":
      //         navigate("/dashboard");
      //         break;

      //     case "Agent":
      //         navigate("/customer");
      //         break;

      //     case "Customer":
      //         navigate("/chit");
      //         break;

      //     default:
      //         navigate("/");
      // }
    } catch (error: any) {
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      //  setLoading(false);
    }
  };

  // const submit = async (e: FormEvent) => {
  //   // e.preventDefault();
  //   try {
  //     //   const r = await doLogin({ email, password }).unwrap();
  //     //   dispatch(login(r));
  //     nav("/setup");
  //   } catch {}
  // };
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
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="mt-2 text-slate-500">Sign in to continue.</p>
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium">
              User ID
              <div className="mt-1 flex items-center gap-2 rounded-xl border px-3">
                <User size={17} className="text-slate-400" />
                <input
                  type="text"
                  value={1}
                  {...register("userCode", {
                    required: "User Id is required",
                  })}
                  className="w-full bg-white px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter User Id"
                />
              </div>
              {errors.userCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.userCode.message}
                </p>
              )}
            </label>
            <label className="block text-sm font-medium">
              Password
              <div className="mt-1 flex items-center gap-2 rounded-xl border px-3">
                <LockKeyhole size={17} className="text-slate-400" />
                <input
                  type="password"
                  value={1}
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </label>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
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
          <p className="mt-4 text-center text-xs text-slate-400">
            Demo: admin@example.com / admin123
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;