import { useCallback, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import RMLoader from "./components/RMLoader";
import RoleGuard from "./middleware/RoleGuard";

import Login from "./pages/Login";
import SignupForm from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Users from "./pages/Users";
import Departments from "./pages/Departments";
import Schedule from "./pages/Schedule";
import Location from "./pages/Location";
import Clients from "./pages/Clients";
import Placeholder from "./pages/Placeholder";
import CreationCards from "./pages/Admin/CreationCards";
import Unauthorized from "./middleware/Unauthorized";

import { useAppSelector } from "./redux/hooks";
import WorkSpace from "./pages/User/WorkSpace";

function AppRoutes() {
  const login = useAppSelector((state) => state.auth.login?.data);
  const token = login?.accessToken;
  console.log('token', token)

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={token ? <Navigate to="/dashboard" replace /> : <SignupForm />} />
      <Route path="/unauthorized" element={token ? <Unauthorized /> : <Navigate to="/login" replace />} />

      {/* Setup: SA and ASC only */}
      <Route path="/setup"
        element={
          <RoleGuard allowedRoles={["SA", "ASC"]}>
            <CreationCards />
          </RoleGuard>
        }
      />

      {/* Authenticated application */}
      <Route
        element={
          <RoleGuard>
            <Layout />
          </RoleGuard>
        }
      >
        {/* All authenticated users */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* User Pages */}
        <Route path="/workSpace"
          element={
            <RoleGuard allowedRoles={["USER"]}>
              <WorkSpace />
            </RoleGuard>} />

        {/* Admin pages */}
        <Route
          path="/users"
          element={
            <RoleGuard allowedRoles={["SA", "ADMIN"]}>
              <Users />
            </RoleGuard>
          }
        />

        <Route
          path="/clients"
          element={
            <RoleGuard allowedRoles={["SA", "ADMIN", "USER"]}>
              <Clients />
            </RoleGuard>
          }
        />

        {/* HR pages */}
        <Route
          path="/departments"
          element={
            <RoleGuard allowedRoles={["SA", "HR"]}>
              <Departments />
            </RoleGuard>
          }
        />

        <Route
          path="/leaves"
          element={
            <RoleGuard allowedRoles={["SA", "HR", "USER"]}>
              <Placeholder title="Leaves" />
            </RoleGuard>
          }
        />

        {/* Example shared pages */}
        <Route
          path="/appointments"
          element={
            <RoleGuard allowedRoles={["SA", "ADMIN", "USER"]}>
              <Appointments />
            </RoleGuard>
          }
        />

        <Route
          path="/schedule"
          element={
            <RoleGuard allowedRoles={["SA", "ADMIN", "HR", "USER"]}>
              <Schedule />
            </RoleGuard>
          }
        />

        <Route
          path="/location"
          element={
            <RoleGuard allowedRoles={["SA", "ADMIN"]}>
              <Location />
            </RoleGuard>
          }
        />

        <Route
          path="/visitors"
          element={
            <RoleGuard allowedRoles={["SA", "ADMIN"]}>
              <Placeholder title="Visitors" />
            </RoleGuard>
          }
        />

        <Route
          path="/services"
          element={
            <RoleGuard allowedRoles={["SA", "ASC", "ADMIN"]}>
              <Placeholder title="Services" />
            </RoleGuard>
          }
        />

        <Route
          path="/activities"
          element={
            <RoleGuard allowedRoles={["SA", "ADMIN"]}>
              <Placeholder title="Activities" />
            </RoleGuard>
          }
        />

        <Route
          path="/reports"
          element={
            <RoleGuard allowedRoles={["SA", "ASC", "ADMIN", "HR"]}>
              <Placeholder title="Reports" />
            </RoleGuard>
          }
        />

        <Route
          path="/expense"
          element={
            <RoleGuard allowedRoles={["SA", "ADMIN"]}>
              <Placeholder title="Expense" />
            </RoleGuard>
          }
        />

        <Route
          path="/income"
          element={
            <RoleGuard allowedRoles={["SA", "ADMIN"]}>
              <Placeholder title="Income" />
            </RoleGuard>
          }
        />

        <Route
          path="/invoice"
          element={
            <RoleGuard allowedRoles={["SA", "ADMIN"]}>
              <Placeholder title="Invoice" />
            </RoleGuard>
          }
        />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to={token ? "/" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  const finishLoading = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <RMLoader onComplete={finishLoading} />}

      <div className={loading ? "invisible" : "visible"}>
        <AppRoutes />
      </div>
    </>
  );
}