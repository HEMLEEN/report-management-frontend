import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Clock3,
  Users,
  Building2,
  MapPin,
  Wrench,
  Activity,
  FileText,
  Briefcase,
  WalletCards,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { resetSelection } from "../redux/features/selectionSlice";
import { useState } from "react";
import { logout } from "../redux/slices/auth/loginSlice";
const groups = [
  {
    label: "",
    items: [
      ["/", "Dashboard", LayoutDashboard],
      ["/appointments", "Appointments", CalendarDays],
      ["/schedule", "Schedule", Clock3],
      ["/visitors", "Visitors", Users],
    ],
  },
  {
    label: "Administration",
    items: [
      ["/users", "Users", Users],
      ["/clients", "Clients", Building2],
      ["/location", "Location", MapPin],
      ["/services", "Services", Wrench],
      ["/activities", "Activities", Activity],
      ["/reports", "Reports", FileText],
    ],
  },
  {
    label: "HRM",
    items: [
      ["/departments", "Department", Briefcase],
      ["/leaves", "Leaves", CalendarDays],
    ],
  },
  {
    label: "Financial & Accounts",
    items: [
      ["/expense", "Expense", WalletCards],
      ["/income", "Income", WalletCards],
      ["/invoice", "Invoice", FileText],
    ],
  },
];
export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState<Record<string, boolean>>({
    Appointments: true,
    Users: true,
    Clients: true,
  });

  const selection = useAppSelector((state) => state.auth);

  const logOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Clear Redux authentication state
    dispatch(logout());

    // Redirect to login
    navigate("/login", { replace: true });
  }

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
                    {["Appointments", "Users", "Clients"].includes(
                      String(label),
                    ) && (
                        <ChevronDown
                          size={15}
                          className="ml-auto"
                          onClick={(e) => {
                            e.preventDefault();
                            setOpen((s) => ({
                              ...s,
                              [String(label)]: !s[String(label)],
                            }));
                          }}
                        />
                      )}
                  </NavLink>
                  {open[String(label)] && String(label) === "Appointments" && (
                    <div className="ml-10 mt-1 space-y-1 text text-sm text-slate-400">
                      <div>Recent</div>
                    </div>
                  )}
                  {open[String(label)] && String(label) === "Users" && (
                    <div className="ml-10 mt-1 text text-sm text-slate-400">
                      Details
                    </div>
                  )}
                  {open[String(label)] && String(label) === "Clients" && (
                    <div className="ml-10 mt-1 space-y-1 text text-sm text-slate-400">
                      <div>Details</div>
                      <div>Schedule</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={() => { logOut() }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>
    </aside>
  );
}
