import { useEffect, useState } from 'react';
import { Appointment } from '../types';
import api from '../services/api';

export default function Appointments() {
  const [items, setItems] = useState<Appointment[]>([]);
  useEffect(()=>{api.get<Appointment[]>('/appointments').then(r=>setItems(r.data));},[]);
  return <div><div className="mb-7"><p className="text-sm font-semibold text-brand-600">Admin</p><h1 className="text-3xl font-bold">Appointments</h1><p className="mt-1 text-sm text-slate-500">Upcoming and recent appointments.</p></div><div className="card overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-400"><tr><th className="px-5 py-4">Client</th><th>Date</th><th>Time</th><th>Purpose</th><th>Status</th></tr></thead><tbody>{items.map(x=><tr key={x.id} className="border-t border-slate-100"><td className="px-5 py-4 font-semibold">{x.client}</td><td>{x.date}</td><td>{x.time}</td><td>{x.purpose}</td><td><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">{x.status}</span></td></tr>)}</tbody></table></div></div></div>;
}