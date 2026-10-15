import { MoreVertical, Edit3, Trash2 } from "lucide-react";
import { useState } from "react";
export default function ActionMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-2 hover:bg-slate-100"
      >
        <MoreVertical size={18} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-32 rounded-xl border bg-white p-1 shadow-lg">
            <button
              onClick={onEdit}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50"
            >
              <Edit3 size={15} />
              Edit
            </button>
            <button
              onClick={onDelete}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
