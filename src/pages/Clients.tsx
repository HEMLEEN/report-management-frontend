import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import api from '../services/api';
import { Client } from '../types';

export default function Clients() {
  const [items, setItems] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  useEffect(() => { api.get<Client[]>('/clients').then((r) => setItems(r.data)); }, []);
  const filtered = items.filter((x) => `${x.name} ${x.company}`.toLowerCase().includes(search.toLowerCase()));
  return <div>
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-brand-600">Administration</p><h1 className="text-3xl font-bold">Clients</h1><p className="mt-1 text-sm text-slate-500">Manage your client records.</p></div><button className="btn-primary flex items-center gap-2"><Plus size={17}/> Add Client</button></div>
    <div className="card overflow-hidden">
      <div className="border-b border-slate-100 p-4"><div className="relative max-w-sm"><Search className="absolute left-3 top-3 text-slate-400" size={17}/><input className="input pl-10" placeholder="Search clients..." value={search} onChange={(e)=>setSearch(e.target.value)}/></div></div>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-400"><tr><th className="px-5 py-4">Client</th><th>Company</th><th>Phone</th><th>Type</th><th>Status</th></tr></thead><tbody>{filtered.map((x)=><tr className="border-t border-slate-100" key={x.id}><td className="px-5 py-4 font-semibold">{x.name}</td><td>{x.company}</td><td>{x.phone}</td><td>{x.type}</td><td><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">{x.status}</span></td></tr>)}</tbody></table></div>
    </div>
  </div>;
}