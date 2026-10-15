import { useEffect } from "react";
import Select from "react-select";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Building2, Check, ChevronRight, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setCompany,
  setPoint,
  setSegment,
  setSource,
} from "../redux/features/selectionSlice";

import { companies, reportMode, reportOptions } from "../Data/setup";

type ReportModeId = "1" | "2" | "3";

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

const sourceOptions: SelectOption[] = reportMode.data.map((item) => ({
  value: item._id,
  label: item.name,
}));

const selectStyles = {
  control: (base: Record<string, unknown>, state: { isFocused: boolean }) => ({
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

const toOptions = (items: string[]): SelectOption[] =>
  items.map((item) => ({
    value: item,
    label: item,
  }));

const Setup = () => {
  const selection = useAppSelector((state) => state.selection);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  const source = useWatch({ control, name: "source" });
  const point = useWatch({ control, name: "point" });
  const company = useWatch({ control, name: "company" });
  const segment = useWatch({ control, name: "segment" });

  const selectedMode = reportMode.data.find((item) => item._id === source);

  const modeId = reportMode.data.some((item) => item._id === source)
    ? (source as ReportModeId)
    : undefined;

  // Keep Redux synchronized with the form.
  useEffect(() => {
    dispatch(setSource(source));
  }, [source, dispatch]);

  useEffect(() => {
    dispatch(setPoint(point));
  }, [point, dispatch]);

  useEffect(() => {
    dispatch(setCompany(company));
  }, [company, dispatch]);

  useEffect(() => {
    dispatch(setSegment(segment));
  }, [segment, dispatch]);

  // Reset dependent selections when the report mode changes.
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

  // Reset company and business type when the report option changes.
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

  // Reset business type when the company changes.
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

  const onSubmit = (data: SetupFormValues) => {
    dispatch(setSource(data.source));
    dispatch(setPoint(data.point));
    dispatch(setCompany(data.company));
    dispatch(setSegment(data.segment));

    navigate("/");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-brand font-bold text-white">
          RM
        </div>

        <h1 className="text-3xl font-bold">Set up your workspace</h1>

        <p className="mt-2 text-slate-500">
          Complete the selections below before entering the main panel.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Report Mode */}
        <section className="rounded-2xl bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-3">
            <UsersRound className="text-brand" />

            <div>
              <h2 className="font-semibold">1. Report Mode</h2>

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
                onChange={(option) => handleSourceChange(option?.value ?? "")}
                placeholder="Select Report Mode"
                styles={selectStyles}
                isClearable
                classNamePrefix="react-select"
              />
            )}
          />

          {errors.source && (
            <p className="mt-2 text-sm text-red-500">{errors.source.message}</p>
          )}
        </section>

        {/* Step 2: Report Options */}
        {modeId && (
          <section className="rounded-2xl bg-white p-6 shadow-soft">
            <h2 className="mb-4 font-semibold">2. Select Report Category</h2>

            <Controller
              name="point"
              control={control}
              rules={{
                required: "Please select a report category.",
              }}
              render={({ field }) => {
                const options = toOptions(reportOptions[modeId] ?? []);

                return (
                  <Select<SelectOption, false>
                    name={field.name}
                    ref={field.ref}
                    options={options}
                    value={
                      options.find((option) => option.value === field.value) ??
                      null
                    }
                    onBlur={field.onBlur}
                    onChange={(option) =>
                      handlePointChange(option?.value ?? "")
                    }
                    placeholder="Select Report Category"
                    styles={selectStyles}
                    isClearable
                    classNamePrefix="react-select"
                  />
                );
              }}
            />

            {errors.point && (
              <p className="mt-2 text-sm text-red-500">
                {errors.point.message}
              </p>
            )}
          </section>
        )}

        {/* Step 3: Companies */}
        {modeId && point && (
          <section className="rounded-2xl bg-white p-6 shadow-soft">
            <h2 className="mb-4 font-semibold">
              3. Select {selectedMode?.name} Company
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {(companies[modeId] ?? []).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleCompanyChange(item)}
                  aria-pressed={company === item}
                  className={`rounded-2xl border p-6 text-left transition ${
                    company === item
                      ? "border-brand bg-brand/5 ring-2 ring-brand/10"
                      : "hover:-translate-y-0.5 hover:shadow-md"
                  }`}
                >
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-slate-100">
                    <Building2 className="text-brand" />
                  </div>

                  <div className="font-semibold">{item}</div>

                  <div className="mt-1 text-sm text-slate-400">
                    Select this workspace
                  </div>

                  {company === item && (
                    <Check className="mt-3 text-brand" size={20} />
                  )}
                </button>
              ))}
            </div>

            {!company && errors.company && (
              <p className="mt-2 text-sm text-red-500">
                {errors.company.message}
              </p>
            )}
          </section>
        )}

        {/* Step 4: Business Type */}
        {company && (
          <section className="rounded-2xl bg-white p-6 shadow-soft">
            <h2 className="mb-4 font-semibold">4. Select Business Type</h2>

            <Controller
              name="segment"
              control={control}
              rules={{
                required: "Please select a business type.",
              }}
              render={({ field }) => (
                <div className="grid gap-4 sm:grid-cols-2">
                  {(["Residential", "Commercial"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => field.onChange(item)}
                      aria-pressed={field.value === item}
                      className={`rounded-2xl border p-5 text-left transition ${
                        field.value === item
                          ? "border-brand bg-brand/5 ring-2 ring-brand/10"
                          : "hover:shadow-md"
                      }`}
                    >
                      <div className="font-semibold">{item}</div>

                      <div className="mt-1 text-sm text-slate-400">
                        {item === "Residential"
                          ? "Residential projects and customers"
                          : "Commercial projects and customers"}
                      </div>

                      {field.value === item && (
                        <Check className="mt-3 text-brand" size={20} />
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
