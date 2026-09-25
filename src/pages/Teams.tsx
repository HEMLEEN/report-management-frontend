import { useEffect, useState } from 'react';
import api from '../services/api';
import { TeamMember } from '../types';

export default function Teams() {
  const [items, setItems] = useState<TeamMember[]>([]);
  useEffect(() => { api.get<TeamMember[]>('/teams').then((r)=>setItems(r.data)); }, []);
  return <div><div className="mb-7"><p className="text-sm font-semibold text-brand-600">People</p><h1 className="text-3xl font-bold">Teams</h1><p className="mt-1 text-sm text-slate-500">Team members and availability.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map((x)=><div className="card p-5" key={x.id}><div className="flex items-center gap-4"><div className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 font-bold text-brand-700">{x.name.slice(0,1)}</div><div><h3 className="font-bold">{x.name}</h3><p className="text-sm text-slate-500">{x.role}</p></div></div><div className="mt-5 flex justify-between text-sm"><span className="text-slate-400">{x.email}</span><span className="font-semibold text-emerald-600">{x.status}</span></div></div>)}</div></div>;
}