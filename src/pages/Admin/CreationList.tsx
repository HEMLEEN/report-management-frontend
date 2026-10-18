import { Pencil, Plus, Trash2 } from "lucide-react";
import type { CreationRecord, CreationType } from "./creation.types";
import { creationLabels } from "./creation.types";
import { UserStatus } from "../../enum/Enum";

interface CreationListProps {
    type: CreationType;
    items: any[];
    onAdd: () => void;
    onEdit: (item: CreationRecord) => void;
    onDelete: (id: string) => void;
    onApprove?: (item: any) => void;
}

const CreationList = ({
    type,
    items,
    onAdd,
    onEdit,
    onDelete,
    onApprove,
}: CreationListProps) => {
    const label = creationLabels[type];

    return (
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">
                        {label} List
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {items.length} {items.length === 1 ? "record" : "records"} found
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onAdd}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Add {label}
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                            <th className="px-5 py-4 font-semibold">{type === "user" ? "User ID" : "S.No"}</th>
                            <th className="px-5 py-4 font-semibold">Name</th>
                            {type === "user" && <th className="px-5 py-4 font-semibold">Status</th>}
                            {type === "user" && <th className="px-5 py-4 font-semibold">Allow</th>}
                            <th className="px-5 py-4 text-right font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {items.length > 0 ? (
                            items.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="px-5 py-4 text-slate-500">
                                        {type === "user" ? item.userCode : index + 1}
                                    </td>

                                    <td className="px-5 py-4 font-medium text-slate-800">
                                        {item.name}
                                    </td>
                                    {type === "user" && <td className="px-5 py-4 font-medium text-slate-800">
                                        {item.status == UserStatus.ACTIVE ? "Active" : "Pending"}
                                    </td>}

                                    {type === "user" && onApprove && (
                                        <td className="px-5 py-4 font-medium text-slate-800">
                                            <button
                                                type="button"
                                                onClick={() => onApprove(item)}
                                                className={`flex w-full items-center py-2 text-sm ${item.status === UserStatus.INACTIVE
                                                    ? "text-green-600 hover:bg-green-50"
                                                    : "text-yellow-600 hover:bg-yellow-50"
                                                    }`}                                          >
                                                {item.status == UserStatus.INACTIVE ? "Set to Approve" : "Deactive"}
                                            </button>

                                        </td>
                                    )}

                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">

                                            <button
                                                type="button"
                                                onClick={() => onEdit(item)}
                                                title={`Edit ${item.name}`}
                                                aria-label={`Edit ${item.name}`}
                                                className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                            >
                                                <Pencil size={17} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onDelete(item.id)}
                                                title={`Delete ${item.name}`}
                                                aria-label={`Delete ${item.name}`}
                                                className="rounded-lg p-2 text-red-600 transition hover:bg-red-50">
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-5 py-12 text-center"
                                >
                                    <p className="font-medium text-slate-700">
                                        No {label.toLowerCase()} records found
                                    </p>
                                    <p className="mt-1 text-slate-500">
                                        Click Add {label} to create your first record.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default CreationList;