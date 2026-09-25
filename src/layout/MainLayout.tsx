import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Activity, BarChart3, Building2, CalendarDays, ChevronDown, ChevronRight, CircleDollarSign, ClipboardList, ContactRound, FileBarChart, Home, LayoutDashboard, LogOut, MapPin, Menu, PanelLeftClose, Settings, Users, UserRound, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import { resetWorkflow } from '../store/workflowSlice';

type Item = { label: string; to?: string; icon?: React.ElementType; children?: { label: string; to: string }[] };

const items: Item[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Admin', icon: Settings, children: [
    { label: 'New', to: '/admin/appointments/new' },
    { label: 'Recent', to: '/admin/appointments/recent' },
  ]},
  { label: 'Schedule', to: '/schedule', icon: CalendarDays },
  { label: 'Visitors', to: '/visitors', icon: ContactRound },
  { label: 'Administration', icon: Settings, children: [
    { label: 'Users / Details', to: '/users/details' },
    { label: 'Clients / Details', to: '/clients/details' },
    { label: 'Clients / Schedule', to: '/clients/schedule' },
  ]},
  { label: 'Location', to: '/location', icon: MapPin },
  { label: 'Services', to: '/services', icon: Building2 },
  { label: 'Activities', to: '/activities', icon: Activity },
  { label: 'Reports', to: '/reports', icon: FileBarChart },
  { label: 'HRM', icon: Users, children: [
    { label: 'Department', to: '/hrm/department' },
    { label: 'Leaves', to: '/hrm/leaves' },
  ]},
  { label: 'Financial & Accounts', icon: CircleDollarSign, children: [
    { label: 'Expense', to: '/finance/expense' },
    { label: 'Income', to: '/finance/income' },
    { label: 'Invoice', to: '/finance/invoice' },
  ]},
];

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<string[]>(['Admin', 'Administration', 'HRM', 'Financial & Accounts']);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const workflow = useAppSelector((s) => s.workflow);

  function signOut() {
    dispatch(logout());
    dispatch(resetWorkflow());
    navigate('/login');
  }

  function toggle(label: string) {
    setExpanded((current) => current.includes(label) ? current.filter((x) => x !== label) : [...current, label]);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {open && <button aria-label="close menu" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white transition-all duration-200 ${collapsed ? 'w-20' : 'w-72'} ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-sm font-black text-white">RM</div>
            {!collapsed && <div className="min-w-0"><p className="truncate font-bold">Report Management</p><p className="truncate text-xs text-slate-400">{workflow.project?.name}</p></div>}
          </Link>
          <button className="hidden rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:block" onClick={() => setCollapsed(!collapsed)}>{collapsed ? <Menu size={18} /> : <PanelLeftClose size={18} />}</button>
          <button className="rounded-lg p-2 text-slate-400 lg:hidden" onClick={() => setOpen(false)}><X size={18} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {!collapsed && <p className="px-3 pb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Panel</p>}
          {items.map((item) => {
            const Icon = item.icon;
            const isGroup = !!item.children;
            const isExpanded = expanded.includes(item.label);
            const activeChild = item.children?.some((child) => location.pathname === child.to);
            return (
              <div key={item.label} className="mb-1">
                {isGroup ? (
                  <button onClick={() => toggle(item.label)} title={collapsed ? item.label : undefined} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${activeChild ? 'text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                    {Icon && <Icon size={18} />}
                    {!collapsed && <><span className="flex-1 text-left">{item.label}</span>{isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}</>}
                  </button>
                ) : (
                  <NavLink to={item.to!} title={collapsed ? item.label : undefined} className={({isActive}) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                    {Icon && <Icon size={18} />}{!collapsed && item.label}
                  </NavLink>
                )}
                {isGroup && isExpanded && !collapsed && <div className="ml-9 mt-1 space-y-1 border-l border-slate-200 pl-2">{item.children!.map((child) => <NavLink key={child.to} to={child.to} className={({isActive}) => `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-brand-50 font-semibold text-brand-700' : 'text-slate-500 hover:bg-slate-50'}`}>{child.label}</NavLink>)}</div>}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <div className={`mb-2 flex items-center gap-3 rounded-xl bg-slate-50 p-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">{user?.name?.slice(0,1)}</div>
            {!collapsed && <div className="min-w-0"><p className="truncate text-sm font-semibold">{user?.name}</p><p className="truncate text-xs text-slate-400">{user?.role}</p></div>}
          </div>
          <button onClick={signOut} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 ${collapsed ? 'justify-center' : ''}`}><LogOut size={18} />{!collapsed && 'Logout'}</button>
        </div>
      </aside>

      <div className={`min-h-screen transition-all duration-200 ${collapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-7">
          <button onClick={() => setOpen(true)} className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"><Menu /></button>
          <div className="hidden sm:block"><p className="text-sm font-semibold text-slate-800">{workflow.project?.name} / {workflow.propertyType}</p><p className="text-xs text-slate-400">{workflow.source?.name} · {workflow.pointOfContact?.name}</p></div>
          <div className="ml-auto flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{user?.name?.slice(0,1)}</div></div>
        </header>
        <main className="p-4 sm:p-7"><Outlet /></main>
      </div>
    </div>
  );
}