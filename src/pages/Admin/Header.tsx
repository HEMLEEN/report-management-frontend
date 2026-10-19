import { LogOut, Plus } from 'lucide-react'

interface HeaderProps {
    title: string;
    titleDesc: string;
    cardButtonName: string;
    openAddModal: () => void;
    onLogout: () => void;
}

const Header = ({ title, titleDesc, cardButtonName, openAddModal, onLogout }: HeaderProps) => {

    return (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {title}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    {titleDesc}
                </p>
            </div>

            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={openAddModal}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                >
                    <Plus size={18} />
                    {cardButtonName}
                </button>

                <button
                    type="button"
                    onClick={onLogout}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Header