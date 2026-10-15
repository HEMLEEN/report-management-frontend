import CrudPage from "./CrudPage";
import {
  useAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} from "../services/api";
import type { Appointment } from "../types";
export default function Appointments() {
  const { data = [] } = useAppointmentsQuery();
  const [c] = useCreateAppointmentMutation();
  const [u] = useUpdateAppointmentMutation();
  const [d] = useDeleteAppointmentMutation();
  const fields = [
    { key: "title" as keyof Appointment, label: "Title" },
    { key: "client" as keyof Appointment, label: "Client" },
    { key: "date" as keyof Appointment, label: "Date", type: "date" },
    { key: "time" as keyof Appointment, label: "Time", type: "time" },
    { key: "status" as keyof Appointment, label: "Status" },
    { key: "location" as keyof Appointment, label: "Location" },
  ];
  return (
    <CrudPage
      title="Appointments"
      description="Create, update and delete appointments."
      data={data}
      fields={fields}
      columns={fields.map((f) => ({ key: f.key, label: f.label }))}
      onCreate={async (x) => {
        await c(x);
      }}
      onUpdate={async (id, x) => {
        await u({ id, body: x });
      }}
      onDelete={async (id) => {
        if (confirm("Delete this appointment?")) await d(id);
      }}
    />
  );
}
