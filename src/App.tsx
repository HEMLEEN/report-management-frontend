import { useCallback, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import RMLoader from "./components/RMLoader";
import RoleGuard from "./middleware/RoleGuard";

import Login from "./pages/Login";
import SignupForm from "./pages/SignUp";
import CreationCards from "./pages/Admin/CreationCards";
import Unauthorized from "./middleware/Unauthorized";

import { useAppSelector } from "./redux/hooks";
import WorkSpace from "./pages/Workspace/WorkSpace";
import Setup from "./pages/Admin/Setup";
import User from "./pages/User/User";
import ReportMode from "./pages/User/ReportMode";
import Company from "./pages/User/Company";
import Category from "./pages/User/Category";
import AdminLayout from "./components/AdminLayout";
import Profile from "./pages/User/Profile";
import Dashboard from "./pages/Workspace/Dashboard";
import UserLayout from "./components/Layout";
import UserDashboard from "./pages/Workspace/UserDashboard";

function AppRoutes() {
  const login = useAppSelector((state) => state.auth.login?.data);
  const token = login?.accessToken;
  console.log('token', token)

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to={token ? "/workspace" : "/login"} replace />} />
      <Route path="/login" element={token ? <Navigate to="/workspace" replace /> : <Login />} />
      <Route path="/signup" element={token ? <Navigate to="/workspace" replace /> : <SignupForm />} />
      <Route path="/unauthorized" element={token ? <Unauthorized /> : <Navigate to="/login" replace />} />

      {/* Setup: SA and ASC only */}
      <Route path="/setup"
        element={
          <RoleGuard allowedRoles={["SA", "ASC"]}>
            <Setup />
          </RoleGuard>
        }
      />


      {/* Authenticated application */}
      <Route
        element={
          <RoleGuard>
            <AdminLayout />
          </RoleGuard>
        }
      >
        <Route path="/user"
          element={
            <RoleGuard allowedRoles={["SA", "ASC"]}>
              <User />
            </RoleGuard>
          }
        />

        {/* <Route path="/profile"
          element={
            <RoleGuard allowedRoles={["SA", "ASC", "A", "USER"]}>
              <Profile />
            </RoleGuard>
          }
        /> */}

        <Route path="/reportMode"
          element={
            <RoleGuard allowedRoles={["SA", "ASC"]}>
              <ReportMode />
            </RoleGuard>
          }
        />

        <Route path="/category"
          element={
            <RoleGuard allowedRoles={["SA", "ASC"]}>
              <Category />
            </RoleGuard>
          }
        />

        <Route path="/company"
          element={
            <RoleGuard allowedRoles={["SA", "ASC"]}>
              <Company />
            </RoleGuard>
          }
        />
      </Route>

      {/* All authenticated users */}
      <Route
        element={
          <UserLayout />
        }
      >
        <Route path="/workspace" element={<WorkSpace />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<Profile />} />
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