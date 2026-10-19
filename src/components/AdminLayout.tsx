import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu, Search, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import ProfileDropdown from "./ProfileDropdown";
import CustomSideBar from "./CustomSideBar";

function getLoggedInUser(): string | null {
  try {
    const rawLogin = localStorage.getItem("login");
    if (!rawLogin) return null;
    const login = JSON.parse(rawLogin);
    return login?.data ?? null;
  } catch {
    console.error("Unable to read the login data from localStorage.");
    return null;
  }
}

export default function AdminLayout() {
  const [mobile, setMobile] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getLoggedInUser());
  }, []);

  const loc = useLocation();
  const title =
    loc.pathname === "/"
      ? "Dashboard"
      : loc.pathname.slice(1).replace(/-/g, " ");
  return (
    <div className="min-h-screen">
      {/* <Sidebar /> */}
      <CustomSideBar />
      {mobile && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobile(false)}
        />
      )}
      <header className="fixed left-0 right-0 top-0 z-20 h-20 border-b bg-white/95 backdrop-blur lg:left-64">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMobile((v) => !v)}>
              <Menu />
            </button>
            <div>
              <h1 className="text-xl font-bold capitalize">{title}</h1>
              <p className="hidden text-xs text-slate-400 sm:block">
                Manage your operations from one place
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-xl p-2 hover:bg-slate-50">
              <Bell size={19} />
            </button>
            <ProfileDropdown user={user} />
          </div>
        </div>
      </header>
      {mobile && (
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white lg:hidden">
          <CustomSideBar />
        </div>
      )}
      <main className="pt-20 lg:ml-64">
        <div className="p-4 sm:p-6">{<Outlet />}</div>
      </main>
    </div>
  );
}
