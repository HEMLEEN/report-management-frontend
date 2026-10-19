import React from 'react'
import Select, { SingleValue } from 'react-select'
import { backgroundOptions, colorOptions, iconOptions, typeOptions } from './options'
import { SelectOption } from './types'

const CardForm = ({ handleSubmit, form, setForm, error, closeModal, editingCard }: any) => {
    return (
        <div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Card Title *
                    </label>
                    <input
                        value={form.title}
                        onChange={(event) =>
                            setForm({ ...form, title: event.target.value })
                        }
                        placeholder="Example: Appointments"
                        required
                        maxLength={60}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Description *
                    </label>
                    <textarea
                        value={form.description}
                        onChange={(event) =>
                            setForm({ ...form, description: event.target.value })
                        }
                        placeholder="Describe what this card does"
                        required
                        maxLength={180}
                        rows={3}
                        className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Navigation Path *
                    </label>
                    <input
                        value={form.path}
                        onChange={(event) =>
                            setForm({ ...form, path: event.target.value })
                        }
                        placeholder="Example: /appointments"
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                        Enter a path configured in your React Router routes.
                    </p>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Card Type
                    </label>
                    <Select
                        options={typeOptions}
                        value={
                            typeOptions.find(
                                (option) => option.value === form.type
                            ) ?? null
                        }
                        onChange={(option: SingleValue<SelectOption>) =>
                            setForm({
                                ...form,
                                type: option?.value ?? "custom",
                            })
                        }
                        isClearable={false}
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Icon
                    </label>
                    <Select
                        options={iconOptions}
                        value={
                            iconOptions.find(
                                (option) => option.value === form.icon
                            ) ?? null
                        }
                        onChange={(option: SingleValue<SelectOption>) =>
                            setForm({
                                ...form,
                                icon: option?.value ?? "Folder",
                            })
                        }
                        isClearable={false}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Icon Color
                        </label>
                        <Select
                            options={colorOptions}
                            value={
                                colorOptions.find(
                                    (option) => option.value === form.iconColor
                                ) ?? null
                            }
                            onChange={(option: SingleValue<SelectOption>) =>
                                setForm({
                                    ...form,
                                    iconColor:
                                        option?.value ?? "text-blue-600",
                                })
                            }
                            isClearable={false}
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Icon Background
                        </label>
                        <Select
                            options={backgroundOptions}
                            value={
                                backgroundOptions.find(
                                    (option) => option.value === form.iconBg
                                ) ?? null
                            }
                            onChange={(option: SingleValue<SelectOption>) =>
                                setForm({
                                    ...form,
                                    iconBg: option?.value ?? "bg-blue-100",
                                })
                            }
                            isClearable={false}
                        />
                    </div>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                    >
                        {error}
                    </div>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        {editingCard ? "Update Card" : "Add Card"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CardForm