import { FormEvent, useState } from "react";
import ActionMenu from "../components/ActionMenu";
import ModalForm from "../components/ModalForm";
import Field from "../components/Field";
type Props<T extends { _id?: string }> = {
  title: string;
  description: string;
  data: T[];
  loading?: boolean;
  fields: { key: keyof T; label: string; type?: string }[];
  onCreate: (x: Partial<T>) => Promise<any>;
  onUpdate: (id: string, x: Partial<T>) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  columns: { key: keyof T; label: string }[];
};
export default function CrudPage<T extends { _id?: string }>({
  title,
  description,
  data,
  fields,
  onCreate,
  onUpdate,
  onDelete,
  columns,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const start = (row?: T) => {
    setEditing(row || null);
    setForm(
      row
        ? Object.fromEntries(
            fields.map((f) => [String(f.key), String(row[f.key] ?? "")]),
          )
        : {},
    );
    setOpen(true);
  };
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (editing?._id) await onUpdate(editing._id, form);
    else await onCreate(form);
    setOpen(false);
  };
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
        <button
          onClick={() => start()}
          className="rounded-xl bg-brand px-4 py-2.5 font-medium text-white"
        >
          + New
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-soft">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b bg-slate-50 text-slate-500">
            <tr>
              {columns.map((c) => (
                <th key={String(c.key)} className="px-5 py-4">
                  {c.label}
                </th>
              ))}
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((row) => (
              <tr key={row._id} className="hover:bg-slate-50/70">
                {columns.map((c) => (
                  <td key={String(c.key)} className="px-5 py-4">
                    {String(row[c.key] ?? "")}
                  </td>
                ))}
                <td className="px-5 py-4 text-right">
                  <ActionMenu
                    onEdit={() => start(row)}
                    onDelete={() => row._id && onDelete(row._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data.length && (
          <div className="p-10 text-center text-sm text-slate-400">
            No records found.
          </div>
        )}
      </div>
      <ModalForm
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit " + title : "Add " + title}
        onSubmit={submit}
      >
        {fields.map((f) => (
          <Field
            key={String(f.key)}
            label={f.label}
            type={f.type || "text"}
            value={form[String(f.key)] || ""}
            onChange={(e) =>
              setForm((x) => ({ ...x, [String(f.key)]: e.target.value }))
            }
            required
          />
        ))}
      </ModalForm>
    </div>
  );
}
