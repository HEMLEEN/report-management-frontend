import CrudPage from "./CrudPage";
import {
  useUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../services/api";
import type { User } from "../types";
export default function Users() {
  const { data = [] } = useUsersQuery();
  const [c] = useCreateUserMutation();
  const [u] = useUpdateUserMutation();
  const [d] = useDeleteUserMutation();
  const fields = [
    { key: "name" as keyof User, label: "Name" },
    { key: "email" as keyof User, label: "Email", type: "email" },
    { key: "role" as keyof User, label: "Role" },
    { key: "status" as keyof User, label: "Status" },
  ];
  return (
    <CrudPage
      title="Users"
      description="User details and access management."
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
        if (confirm("Delete this user?")) await d(id);
      }}
    />
  );
}
