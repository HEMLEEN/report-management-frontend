import { ArrowUpRight, Folder, Pencil, Trash2 } from 'lucide-react';
import React from 'react'
import { iconMap } from './options';
import { defaultCards } from './types';

const Cards = ({ cards, openEditModal, handleDelete, handleCardClick }: any) => {
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((card: any) => {
                const Icon = iconMap[card.icon] ?? Folder;
                const isDefault = defaultCards.some(
                    (item) => item.id === card.id
                );

                return (
                    <div
                        key={card.id}
                        className="group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                    >
                        {/* Edit/Delete controls */}
                        <div className="absolute right-3 top-3 flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                            <button
                                type="button"
                                title="Edit card"
                                onClick={() => openEditModal(card)}
                                className="rounded-md p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                            >
                                <Pencil size={16} />
                            </button>

                            {!isDefault && (
                                <button
                                    type="button"
                                    title="Delete card"
                                    onClick={() => handleDelete(card)}
                                    className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => handleCardClick(card)}
                            className="block w-full text-left"
                            aria-label={`Open ${card.title}`}
                        >
                            <div
                                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}
                            >
                                <Icon size={24} className={card.iconColor} />
                            </div>

                            <h2 className="pr-12 text-lg font-semibold text-gray-900">
                                {card.title}
                            </h2>

                            <p className="mt-2 min-h-10 text-sm leading-5 text-gray-500">
                                {card.description}
                            </p>

                            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                                <span className="max-w-[80%] truncate text-xs text-gray-400">
                                    {card.path}
                                </span>
                                <ArrowUpRight
                                    size={18}
                                    className="shrink-0 text-gray-400 transition group-hover:text-blue-600"
                                />
                            </div>
                        </button>
                    </div>
                );
            })}
        </div>
    )
}

export default Cards