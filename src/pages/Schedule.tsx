import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import api from '../services/api';
import { ScheduleItem } from '../types';

export default function Schedule() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  useEffect(()=>{api.get<ScheduleItem[]>('/schedule').then(r=>setItems(r.data));},[]);
  return <div><div className="mb-7"><p className="text-sm font-semibold text-brand-600">Planning</p><h1 className="text-3xl font-bold">Schedule</h1><p className="mt-1 text-sm text-slate-500">Upcoming activities and assignments.</p></div><div className="space-y-3">{items.map(x=><div key={x.id} className="card flex flex-wrap items-center gap-4 p-5"><div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><CalendarDays size={20}/></div><div className="flex-1"><p className="font-bold">{x.title}</p><p className="text-sm text-slate-500">{x.owner}</p></div><div className="text-right"><p className="font-semibold">{x.date}</p><p className="text-sm text-slate-400">{x.time}</p></div></div>)}</div></div>;
}