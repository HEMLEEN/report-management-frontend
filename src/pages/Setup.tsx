
import { useEffect, useMemo } from "react";
import Select from "react-select";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Building2,
  Check,
  ChevronRight,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../redux/hooks";

import {
  setCompany,
  setPoint,
  setSegment,
  setSource,
} from "../redux/features/selectionSlice";

import { listReportMode } from "../redux/slices/setup/thunkApi";

// --------------------------------------------------
// Types
// --------------------------------------------------

type SetupCategory = {
  _id: string;
  name: string;
};

type SetupCompany = {
  _id: string;
  name: string;
};

type SetupReportMode = {
  _id: string;
  name: string;
  category: SetupCategory[];
  company: SetupCompany[];
  createdAt?: string;
  updatedAt?: string;
};

type SetupFormValues = {
  source: string;
  point: string;
  company: string;
  segment: "Residential" | "Commercial" | "";
};

type SelectOption = {
  value: string;
  label: string;
};

// --------------------------------------------------
// React Select styles
// --------------------------------------------------

const selectStyles = {
  control: (
    base: Record<string, unknown>,
    state: { isFocused: boolean },
  ) => ({
    ...base,
    minHeight: "48px",
    borderRadius: "12px",
    borderColor: state.isFocused ? "#6366f1" : "#e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 1px #6366f1" : "none",
    "&:hover": {
      borderColor: "#6366f1",
    },
  }),
  menu: (base: Record<string, unknown>) => ({
    ...base,
    zIndex: 50,
  }),
};

// --------------------------------------------------
// Setup Component
// --------------------------------------------------

const Setup = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux state
  const selection = useAppSelector((state) => state.selection);

  const {
    list,
    isReportModeLoading,
    reportModeError,
  } = useAppSelector((state) => state.reportMode);

  // Fetch report modes from API
  useEffect(() => {
    dispatch(listReportMode({ name: "" }));
  }, [dispatch]);

  // Form initialization
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SetupFormValues>({
    defaultValues: {
      source: selection.source || "",
      point: selection.point || "",
      company: selection.company || "",
      segment: selection.segment || "",
    },
    mode: "onChange",
  });

  // Watch form values
  const source = useWatch({
    control,
    name: "source",
  });

  const point = useWatch({
    control,
    name: "point",
  });

  const company = useWatch({
    control,
    name: "company",
  });

  const segment = useWatch({
    control,
    name: "segment",
  });

  // Convert API data to a consistent type.
  // Prefer typing `list` in your Redux slice as SetupReportMode[].
  const reportModes = useMemo(
    () => list as SetupReportMode[],
    [list],
  );

  // Report mode options
  const sourceOptions: SelectOption[] = useMemo(
    () =>
      reportModes.map((item) => ({
        value: item._id,
        label: item.name,
      })),
    [reportModes],
  );

  // Find selected report mode
  const selectedMode = reportModes.find(
    (item) => item._id === source,
  );

  // Category options for the selected report mode
  const categoryOptions: SelectOption[] = useMemo(
    () =>
      (selectedMode?.category ?? []).map((item) => ({
        value: item._id,
        label: item.name,
      })),
    [selectedMode],
  );

  // Find selected category
  const selectedCategory = selectedMode?.category.find(
    (item) => item._id === point,
  );

  // Find selected company
  const selectedCompany = selectedMode?.company.find(
    (item) => item._id === company,
  );

  // --------------------------------------------------
  // Keep Redux synchronized with the form
  // --------------------------------------------------

  useEffect(() => {
    dispatch(setSource(source || ""));
  }, [source, dispatch]);

  useEffect(() => {
    dispatch(setPoint(point || ""));
  }, [point, dispatch]);

  useEffect(() => {
    dispatch(setCompany(company || ""));
  }, [company, dispatch]);

  useEffect(() => {
    dispatch(setSegment(segment || ""));
  }, [segment, dispatch]);

  // --------------------------------------------------
  // Reset dependent fields
  // --------------------------------------------------

  const handleSourceChange = (value: string) => {
    setValue("source", value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("point", "", {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("company", "", {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("segment", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handlePointChange = (value: string) => {
    setValue("point", value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("company", "", {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("segment", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleCompanyChange = (value: string) => {
    setValue("company", value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("segment", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const onSubmit = (data: SetupFormValues) => {
    dispatch(setSource(data.source));
    dispatch(setPoint(data.point));
    dispatch(setCompany(data.company));
    dispatch(setSegment(data.segment));

    navigate("/");
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-brand font-bold text-white">
          RM
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          Set up your workspace
        </h1>

        <p className="mt-2 text-slate-500">
          Complete the selections below before entering the main panel.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Step 1: Report Mode */}
        <section className="rounded-2xl bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-3">
            <UsersRound className="text-brand" />

            <div>
              <h2 className="font-semibold text-slate-900">
                1. Report Mode
              </h2>

              <p className="text-sm text-slate-400">
                Choose your report system workspace.
              </p>
            </div>
          </div>

          <Controller
            name="source"
            control={control}
            rules={{
              required: "Please select a report mode.",
            }}
            render={({ field }) => (
              <Select<SelectOption, false>
                name={field.name}
                ref={field.ref}
                options={sourceOptions}
                value={
                  sourceOptions.find(
                    (option) => option.value === field.value,
                  ) ?? null
                }
                onBlur={field.onBlur}
                onChange={(option) =>
                  handleSourceChange(option?.value ?? "")
                }
                placeholder="Select Report Mode"
                styles={selectStyles}
                isClearable
                // isLoading={isReportModeLoading}
                // isDisabled={isReportModeLoading}
                classNamePrefix="react-select"
              />
            )}
          />

          {errors.source && (
            <p className="mt-2 text-sm text-red-500">
              {errors.source.message}
            </p>
          )}

          {reportModeError && (
            <p className="mt-2 text-sm text-red-500">
              Failed to load report modes. Please try again.
            </p>
          )}

          {!isReportModeLoading &&
            !reportModeError &&
            reportModes.length === 0 && (
              <p className="mt-2 text-sm text-slate-500">
                No report modes available.
              </p>
            )}
        </section>

        {/* Step 2: Report Category */}
        {selectedMode && (
          <section className="rounded-2xl bg-white p-6 shadow-soft">
            <div className="mb-4">
              <h2 className="font-semibold text-slate-900">
                2. Select Report Category
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Choose a category for {selectedMode.name}.
              </p>
            </div>

            <Controller
              name="point"
              control={control}
              rules={{
                required: "Please select a report category.",
              }}
              render={({ field }) => (
                <Select<SelectOption, false>
                  name={field.name}
                  ref={field.ref}
                  options={categoryOptions}
                  value={
                    categoryOptions.find(
                      (option) => option.value === field.value,
                    ) ?? null
                  }
                  onBlur={field.onBlur}
                  onChange={(option) =>
                    handlePointChange(option?.value ?? "")
                  }
                  placeholder="Select Report Category"
                  styles={selectStyles}
                  isClearable
                  isDisabled={categoryOptions.length === 0}
                  classNamePrefix="react-select"
                />
              )}
            />

            {errors.point && (
              <p className="mt-2 text-sm text-red-500">
                {errors.point.message}
              </p>
            )}

            {categoryOptions.length === 0 && (
              <p className="mt-2 text-sm text-slate-500">
                No categories are assigned to this report mode.
              </p>
            )}
          </section>
        )}

        {/* Step 3: Company Selection */}
        {selectedMode && point && selectedCategory && (
          <section className="rounded-2xl bg-white p-6 shadow-soft">
            <div className="mb-4">
              <h2 className="font-semibold text-slate-900">
                3. Select {selectedMode.name} Company
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Choose the company you want to work with.
              </p>
            </div>

            <Controller
              name="company"
              control={control}
              rules={{
                required: "Please select a company.",
              }}
              render={({ field }) => (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {selectedMode.company.map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => handleCompanyChange(item._id)}
                      aria-pressed={field.value === item._id}
                      className={`rounded-2xl border p-6 text-left transition ${field.value === item._id
                        ? "border-brand bg-brand/5 ring-2 ring-brand/10"
                        : "border-slate-200 hover:-translate-y-0.5 hover:shadow-md"
                        }`}
                    >
                      <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-slate-100">
                        <Building2 className="text-brand" />
                      </div>

                      <div className="font-semibold text-slate-900">
                        {item.name}
                      </div>

                      <div className="mt-1 text-sm text-slate-400">
                        Select this workspace
                      </div>

                      {field.value === item._id && (
                        <Check
                          className="mt-3 text-brand"
                          size={20}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            />

            {errors.company && (
              <p className="mt-2 text-sm text-red-500">
                {errors.company.message}
              </p>
            )}

            {selectedMode.company.length === 0 && (
              <p className="text-sm text-slate-500">
                No companies are assigned to this report mode.
              </p>
            )}
          </section>
        )}

        {/* Step 4: Business Type */}
        {selectedCompany && (
          <section className="rounded-2xl bg-white p-6 shadow-soft">
            <div className="mb-4">
              <h2 className="font-semibold text-slate-900">
                4. Select Business Type
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Choose your business workspace.
              </p>
            </div>

            <Controller
              name="segment"
              control={control}
              rules={{
                required: "Please select a business type.",
              }}
              render={({ field }) => (
                <div className="grid gap-4 sm:grid-cols-2">
                  {(
                    ["Residential", "Commercial"] as const
                  ).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => field.onChange(item)}
                      aria-pressed={field.value === item}
                      className={`rounded-2xl border p-5 text-left transition ${field.value === item
                        ? "border-brand bg-brand/5 ring-2 ring-brand/10"
                        : "border-slate-200 hover:shadow-md"
                        }`}
                    >
                      <div className="font-semibold text-slate-900">
                        {item}
                      </div>

                      <div className="mt-1 text-sm text-slate-400">
                        {item === "Residential"
                          ? "Residential projects and customers"
                          : "Commercial projects and customers"}
                      </div>

                      {field.value === item && (
                        <Check
                          className="mt-3 text-brand"
                          size={20}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            />

            {errors.segment && (
              <p className="mt-2 text-sm text-red-500">
                {errors.segment.message}
              </p>
            )}

            <button
              type="submit"
              disabled={!source || !point || !company || !segment}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue to Dashboard
              <ChevronRight size={18} />
            </button>
          </section>
        )}
      </form>
    </div>
  );
};

export default Setup;
