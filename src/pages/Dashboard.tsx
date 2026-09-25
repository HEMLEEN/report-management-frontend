import { useEffect, useState } from 'react';
import { ArrowUpRight, CalendarDays, CircleDollarSign, ContactRound, Users } from 'lucide-react';
import api from '../services/api';
import { useAppSelector } from '../store/hooks';

interface DashboardData { clients: number; appointments: number; revenue: number; team: number; }

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const workflow = useAppSelector((s) => s.workflow);
  useEffect(() => { api.get<DashboardData>('/dashboard').then((r) => setData(r.data)); }, []);
  const cards = [
    { label: 'Total Clients', value: data?.clients ?? 0, icon: ContactRound },
    { label: 'Appointments', value: data?.appointments ?? 0, icon: CalendarDays },
    { label: 'Revenue', value: `₹${(data?.revenue ?? 0).toLocaleString()}`, icon: CircleDollarSign },
    { label: 'Team Members', value: data?.team ?? 0, icon: Users },
  ];
  return (
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-semibold text-brand-600">Overview</p><h1 className="text-3xl font-bold">Dashboard</h1><p className="mt-1 text-sm text-slate-500">Welcome to your management workspace.</p></div>
        <div className="rounded-xl bg-white px-4 py-3 text-sm shadow-sm"><span className="text-slate-400">Property: </span><b>{workflow.propertyType}</b></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({label,value,icon:Icon}) => <div className="card p-5" key={label}><div className="flex items-start justify-between"><div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><Icon size={21}/></div><ArrowUpRight size={18} className="text-slate-300"/></div><p className="mt-5 text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>)}</div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2"><h2 className="font-bold">Activity Overview</h2><div className="mt-6 grid h-56 place-items-center rounded-2xl bg-slate-50 text-sm text-slate-400">Chart area — connect Chart.js or Recharts here.</div></div>
        <div className="card p-6"><h2 className="font-bold">Current Setup</h2><div className="mt-5 space-y-4 text-sm"><Info label="Source" value={workflow.source?.name}/><Info label="Contact" value={workflow.pointOfContact?.name}/><Info label="Project" value={workflow.project?.name}/><Info label="Type" value={workflow.propertyType}/></div></div>
      </div>
    </div>
  );
}
function Info({label,value}:{label:string;value?:string|null}) { return <div className="flex justify-between gap-4 border-b border-slate-100 pb-3"><span className="text-slate-400">{label}</span><span className="font-semibold text-right">{value}</span></div>; }