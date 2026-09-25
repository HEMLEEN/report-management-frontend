import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Teams from './pages/Teams';
import Appointments from './pages/Appointments';
import Schedule from './pages/Schedule';
import Placeholder from './pages/Placeholder';
import MainLayout from './layout/MainLayout';

function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector((s) => s.auth);
  const { completed } = useAppSelector((s) => s.workflow);
  if (!user) return <Navigate to="/login" replace />;
  if (!completed) return <Navigate to="/setup" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/setup" element={<Onboarding />} />
      <Route path="/" element={<Protected><MainLayout /></Protected>}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="teams" element={<Teams />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="admin/appointments/new" element={<Placeholder title="New Appointment" />} />
        <Route path="admin/appointments/recent" element={<Placeholder title="Recent Appointments" />} />
        <Route path="visitors" element={<Placeholder title="Visitors" />} />
        <Route path="users/details" element={<Placeholder title="User Details" />} />
        <Route path="clients/details" element={<Clients />} />
        <Route path="clients/schedule" element={<Schedule />} />
        <Route path="location" element={<Placeholder title="Location" />} />
        <Route path="services" element={<Placeholder title="Services" />} />
        <Route path="activities" element={<Placeholder title="Activities" />} />
        <Route path="reports" element={<Placeholder title="Reports" />} />
        <Route path="hrm/department" element={<Placeholder title="Departments" />} />
        <Route path="hrm/leaves" element={<Placeholder title="Leaves" />} />
        <Route path="finance/expense" element={<Placeholder title="Expenses" />} />
        <Route path="finance/income" element={<Placeholder title="Income" />} />
        <Route path="finance/invoice" element={<Placeholder title="Invoices" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}