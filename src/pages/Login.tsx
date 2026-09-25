import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { useAppDispatch } from '../store/hooks';
import { setSession } from '../store/authSlice';

export default function Login() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      dispatch(setSession(data));
      navigate('/setup');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-brand-700 to-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 font-bold">RM</div>
              <span className="text-xl font-bold">Report Management</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight">Manage your reports, clients and operations in one place.</h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-blue-100">A responsive administration workspace built with React, TypeScript, Tailwind and Redux Toolkit.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-100"><ShieldCheck size={18} /> Secure workspace</div>
        </div>

        <form onSubmit={submit} className="flex flex-col justify-center p-7 sm:p-12">
          <div className="mb-8">
            <p className="text-sm font-semibold text-brand-600">Welcome back</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Use your account to continue.</p>
          </div>

          <label className="mb-2 text-sm font-semibold">Email</label>
          <div className="relative mb-5">
            <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input className="input pl-11" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </div>

          <label className="mb-2 text-sm font-semibold">Password</label>
          <div className="relative mb-6">
            <LockKeyhole className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input className="input pl-11" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          </div>

          {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="btn-primary">{loading ? 'Signing in...' : 'Sign in'}</button>
          <p className="mt-5 text-center text-xs text-slate-400">Demo: admin@example.com / admin123</p>
        </form>
      </div>
    </div>
  );
}