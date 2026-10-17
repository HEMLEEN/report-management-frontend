import { useEffect, useState } from "react";
import { Check, Plus, Pencil, Trash2, Link2, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  createCategory,
  createCompany,
  createReportMode,
  listCategory,
  listCompany,
  listReportMode,
} from "../../redux/slices/setup/thunkApi";

type SetupType = "ReportMode" | "Category" | "Company";
type ModalAction = "Add" | "Edit";
type AssignType = "Category" | "Company";

type FormValues = {
  segment: SetupType | "";
};

type NameFormValues = {
  name: string;
};

type AssignFormValues = {
  reportModeId: string;
  category: string[];
  compny: string[];
};

const ReportMode = () => {
  const dispatch = useAppDispatch();

  const { control, watch } = useForm<FormValues>({
    defaultValues: { segment: "" },
    mode: "onChange",
  });

  const selectedSegment = watch("segment");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NameFormValues>({
    defaultValues: { name: "" },
    mode: "onChange",
  });

  const {
    register: registerAssign,
    handleSubmit: handleAssignSubmit,
    reset: resetAssign,
    watch: watchAssign,
    setValue,
    formState: { isSubmitting: isAssigning },
  } = useForm<AssignFormValues>({
    defaultValues: {
      reportModeId: "",
      category: [],
      compny: [],
    },
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<ModalAction>("Add");
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignType, setAssignType] = useState<AssignType>("Category");

  const selectedReportModeId = watchAssign("reportModeId");
  const selectedCategories = watchAssign("category");
  const selectedCompanies = watchAssign("compny");

  const { list, isReportModeLoading, reportModeError } = useAppSelector((state) => state.reportMode);
  const { listOfCategories, isCategoryLoading, categoryError } = useAppSelector((state) => state.category);

  // Replace these selectors with your actual category/company Redux slices.
  // Each item must contain _id and name.
  const categories: { _id: string; name: string }[] = [];
  const companies: { _id: string; name: string }[] = [];

  useEffect(() => {
    dispatch(listReportMode({ name: "" }));
  }, [dispatch]);

  const openModal = (action: ModalAction) => {
    setModalAction(action);
    reset({ name: "" });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    reset({ name: "" });
  };

  const onSubmit = async (data: NameFormValues) => {
    try {
      const name = data.name.trim();

      if (!name || !selectedSegment) return;

      if (selectedSegment === "ReportMode") {
        await dispatch(createReportMode({ name })).unwrap();
        await dispatch(listReportMode({ name: "" })).unwrap();
      } else if (selectedSegment === "Category") {
        await dispatch(createCategory({ name })).unwrap();
        await dispatch(listCategory({ name: "" })).unwrap();
      } else {
        await dispatch(createCompany({ name })).unwrap();
        await dispatch(listCompany({ name: "" })).unwrap();
      }

      closeModal();
    } catch (err) {
      console.error(`Failed to save ${selectedSegment}:`, err);
    }
  };

  const openAssignModal = (type: AssignType) => {
    setAssignType(type);
    resetAssign({
      reportModeId: "",
      category: [],
      compny: [],
    });
    setAssignOpen(true);
  };

  const closeAssignModal = () => {
    setAssignOpen(false);
    resetAssign({
      reportModeId: "",
      category: [],
      compny: [],
    });
  };

  const toggleSelection = (field: "category" | "compny", id: string) => {
    const current =
      field === "category" ? selectedCategories : selectedCompanies;

    setValue(
      field,
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const onAssignSubmit = async (data: AssignFormValues) => {
    try {
      if (!data.reportModeId) {
        throw new Error("Please select a Report Mode.");
      }

      if (assignType === "Category") {
        if (!data.category.length) {
          throw new Error("Please select at least one category.");
        }

        const payload = {
          reportModeId: data.reportModeId,
          category: data.category,
        };

        // TODO: Dispatch your category-assignment thunk here.
        // Example:
        // await dispatch(assignCategory(payload)).unwrap();

        console.log("Assign category payload:", payload);
      } else {
        if (!data.compny.length) {
          throw new Error("Please select at least one company.");
        }

        const payload = {
          reportModeId: data.reportModeId,
          compny: data.compny,
        };

        // TODO: Dispatch your company-assignment thunk here.
        // Example:
        // await dispatch(assignCompany(payload)).unwrap();

        console.log("Assign company payload:", payload);
      }

      // Close after your assignment API succeeds.
      // Uncomment when the API dispatches are connected:
      // closeAssignModal();
    } catch (err) {
      console.error("Assignment failed:", err);
    }
  };

  const handleDelete = () => {
    console.log("Delete:", selectedSegment);
    // Connect your delete API.
  };

  const actions = [
    {
      label: "Add",
      icon: Plus,
      color: "bg-blue-600 hover:bg-blue-700",
      onClick: () => openModal("Add"),
    },
    {
      label: "Edit",
      icon: Pencil,
      color: "bg-amber-500 hover:bg-amber-600",
      onClick: () => openModal("Edit"),
    },
    {
      label: "Delete",
      icon: Trash2,
      color: "bg-red-600 hover:bg-red-700",
      onClick: handleDelete,
    },
  ];

  return (
    <>
      <section className="rounded-2xl bg-white p-6 shadow-soft">
        <h2 className="mb-4 font-semibold">Setup Management</h2>

        <Controller
          name="segment"
          control={control}
          rules={{ required: "Please select a setup type." }}
          render={({ field }) => (
            <div className="grid gap-4 sm:grid-cols-3">
              {(["ReportMode", "Category", "Company"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => field.onChange(item)}
                  aria-pressed={field.value === item}
                  className={`rounded-2xl border p-5 text-left transition ${
                    field.value === item
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                      : "border-gray-200 hover:shadow-md"
                  }`}
                >
                  <div className="font-semibold">{item}</div>
                  {field.value === item && (
                    <Check className="mt-3 text-blue-600" size={20} />
                  )}
                </button>
              ))}
            </div>
          )}
        />

        {selectedSegment && (
          <div className="mt-6 border-t border-gray-200 pt-5">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">
              {selectedSegment} Management
            </h3>

            <div className="flex flex-wrap gap-3">
              {actions.map(({ label, icon: Icon, color, onClick }) => (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white ${color}`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}

              {selectedSegment === "ReportMode" && (
                <>
                  <button
                    type="button"
                    onClick={() => openAssignModal("Category")}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    <Link2 size={16} />
                    Assign Category
                  </button>

                  <button
                    type="button"
                    onClick={() => openAssignModal("Company")}
                    className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700"
                  >
                    <Link2 size={16} />
                    Assign Company
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {selectedSegment === "ReportMode" && (
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold">Report Mode List</h3>

            {isReportModeLoading.list && <p>Loading report modes...</p>}

            {reportModeError && <p className="text-sm text-red-500">{String(reportModeError)}</p>}

            {!isReportModeLoading.list && list.length === 0 && (
              <p className="text-sm text-gray-500">No report modes found.</p>
            )}

            {list.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Categories: {item.category.length} | Companies:{" "}
                    {item.company.length}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add/Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="font-semibold">
                {modalAction} {selectedSegment}
              </h2>
              <button type="button" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6">
                <label
                  htmlFor="setup-name"
                  className="mb-2 block text-sm font-medium"
                >
                  Name *
                </label>
                <input
                  id="setup-name"
                  {...register("name", {
                    required: "Name is required.",
                    validate: (value) =>
                      value.trim().length > 0 || "Name cannot be empty.",
                  })}
                  placeholder={`Enter ${selectedSegment} name`}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 bg-gray-50 px-6 py-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving..."
                    : modalAction === "Add"
                      ? "Submit"
                      : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Category / Company modal */}
      {assignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="assign-title"
            className="my-8 w-full max-w-lg rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 id="assign-title" className="font-semibold">
                Assign {assignType} to Report Mode
              </h2>
              <button
                type="button"
                onClick={closeAssignModal}
                aria-label="Close assignment modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit(onAssignSubmit)}>
              <div className="space-y-5 p-6">
                <div>
                  <label
                    htmlFor="report-mode"
                    className="mb-2 block text-sm font-medium"
                  >
                    Report Mode *
                  </label>

                  <select
                    id="report-mode"
                    {...registerAssign("reportModeId", {
                      required: true,
                    })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                  >
                    <option value="">Select Report Mode</option>
                    {listOfCategories.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">
                    Select {assignType}s *
                  </p>

                  <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-3">
                    {(assignType === "Category" ? categories : companies)
                      .length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No {assignType.toLowerCase()} data configured. Connect
                        your category/company list Redux state.
                      </p>
                    ) : (
                      (assignType === "Category" ? categories : companies).map(
                        (item) => {
                          const field =
                            assignType === "Category" ? "category" : "compny";

                          const checked =
                            field === "category"
                              ? selectedCategories.includes(item._id)
                              : selectedCompanies.includes(item._id);

                          return (
                            <label
                              key={item._id}
                              className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  toggleSelection(field, item._id)
                                }
                                className="h-4 w-4 accent-blue-600"
                              />
                              <span className="text-sm">{item.name}</span>
                            </label>
                          );
                        },
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 bg-gray-50 px-6 py-4">
                <button
                  type="button"
                  onClick={closeAssignModal}
                  className="rounded-lg border px-4 py-2"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isAssigning ||
                    !selectedReportModeId ||
                    (assignType === "Category"
                      ? selectedCategories.length === 0
                      : selectedCompanies.length === 0)
                  }
                  className="rounded-lg bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAssigning ? "Assigning..." : "Assign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportMode;
