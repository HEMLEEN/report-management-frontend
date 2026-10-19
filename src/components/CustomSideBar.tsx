import { CalendarDays, LayoutDashboard, Settings } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

const groups = [
    {
        label: "Setup",
        items: [
            ["/setup", "Admin Management", Settings],
            ["/workspace", "Worksapce", LayoutDashboard],
            ["/dashboard", "Dashboard", Settings],
        ],
    },
]

const CustomSideBar = () => {

    return (
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 overflow-y-auto border-r bg-white lg:block">
            <div className="flex h-20 items-center gap-3 border-b px-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white font-bold">
                    RM
                </div>
                <div>
                    <div className="font-bold">Report Management</div>
                    <div className="text-xs text-slate-400">Control Panel</div>
                </div>
            </div>

            <nav className="p-4 space-y-5">
                {groups.map((g) => (
                    <div key={g.label}>
                        {g.label && (
                            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {g.label}
                            </p>
                        )}

                        <div className="space-y-1">
                            {g.items.map(([to, label, Icon]) => (
                                <div key={String(to)}>
                                    <NavLink
                                        to={String(to)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${isActive ? "bg-brand/10 text-brand" : "text-slate-600 hover:bg-slate-50"}`
                                        }
                                    >
                                        <Icon size={18} />
                                        <span>{String(label)}</span>
                                    </NavLink>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    )
}

export default CustomSideBar
