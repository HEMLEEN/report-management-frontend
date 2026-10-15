import CrudPage from "./CrudPage";
import {
  useDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} from "../services/api";
import type { Department } from "../types";
export default function Departments() {
  const { data = [] } = useDepartmentsQuery();
  const [c] = useCreateDepartmentMutation();
  const [u] = useUpdateDepartmentMutation();
  const [d] = useDeleteDepartmentMutation();
  const fields = [
    { key: "name" as keyof Department, label: "Department" },
    { key: "head" as keyof Department, label: "Department Head" },
    { key: "status" as keyof Department, label: "Status" },
  ];
  return (
    <CrudPage
      title="HRM Department"
      description="Manage departments and department heads."
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
        if (confirm("Delete this department?")) await d(id);
      }}
    />
  );
}
