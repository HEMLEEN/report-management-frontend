import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../services/api";
import { useAppDispatch } from "../hooks";
import { login } from "../features/authSlice";
import { LockKeyhole, Mail } from "lucide-react";
export default function Login() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [doLogin, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const submit = async (e: FormEvent) => {
    // e.preventDefault();
    try {
    //   const r = await doLogin({ email, password }).unwrap();
    //   dispatch(login(r));
      nav("/setup");
    } catch {}
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
        <form onSubmit={submit} className="w-full max-w-md">
          <div className="mb-8">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-brand font-bold text-white">
              RM
            </div>
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="mt-2 text-slate-500">Sign in to continue.</p>
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium">
              Email
              <div className="mt-1 flex items-center gap-2 rounded-xl border px-3">
                <Mail size={17} className="text-slate-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 outline-none"
                />
              </div>
            </label>
            <label className="block text-sm font-medium">
              Password
              <div className="mt-1 flex items-center gap-2 rounded-xl border px-3">
                <LockKeyhole size={17} className="text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 outline-none"
                />
              </div>
            </label>
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-500">
              Login failed. Check your credentials or make sure the API is
              running.
            </p>
          )}
          <button
            disabled={doLogin.isLoading}
            className="mt-6 w-full rounded-xl bg-brand py-3 font-semibold text-white disabled:opacity-60"
          >
            {doLogin.isLoading ? "Signing in..." : "Sign in"}
          </button>
          <p className="mt-4 text-center text-xs text-slate-400">
            Demo: admin@example.com / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
