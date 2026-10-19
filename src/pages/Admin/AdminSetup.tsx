
import { useEffect, useState } from "react";
import Select, { type SingleValue } from "react-select";
import {
    ArrowUpRight,
    Building2,
    BriefcaseBusiness,
    FilePlus2,
    FileText,
    Folder,
    LogOut,
    Plus,
    Settings,
    Tags,
    UserRoundPlus,
    X,
    Trash2,
    Pencil,
    type LucideIcon,
} from "lucide-react";
import { AdminCard, AdminSetupProps, defaultCards, FormValues, LOGIN_KEY, SelectOption, STORAGE_KEY } from "./types";
import { backgroundOptions, colorOptions, emptyForm, iconMap } from "./options";
import { useAppDispatch } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/auth/loginSlice";
import Header from "./Header";
import Cards from "./Cards";
import CardForm from "./CardForm";

// Reads the user identifier from localStorage["login"].
function getLoggedInUserId(): string | null {
    try {
        const rawLogin = localStorage.getItem(LOGIN_KEY);
        if (!rawLogin) return null;
        const login = JSON.parse(rawLogin);
        return login?.data?.userCode ?? null;
    } catch {
        console.error("Unable to read the login data from localStorage.");
        return null;
    }
}

function isValidCard(value: unknown): value is AdminCard {
    if (!value || typeof value !== "object") return false;

    const card = value as Partial<AdminCard>;

    return (
        typeof card.id === "string" &&
        typeof card.title === "string" &&
        typeof card.description === "string" &&
        typeof card.icon === "string" &&
        typeof card.type === "string" &&
        typeof card.iconColor === "string" &&
        typeof card.iconBg === "string" &&
        typeof card.path === "string" &&
        Boolean(iconMap[card.icon]) &&
        colorOptions.some((item) => item.value === card.iconColor) &&
        backgroundOptions.some((item) => item.value === card.iconBg)
    );
}

export default function AdminSetup({ onCardClick, }: AdminSetupProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [userId, setUserId] = useState<string | null>(null);
    const [cards, setCards] = useState<AdminCard[]>(defaultCards);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<AdminCard | null>(null);
    const [form, setForm] = useState<FormValues>(emptyForm);
    const [error, setError] = useState("");

    // Read the logged-in user ID from localStorage.
    useEffect(() => {
        setUserId(getLoggedInUserId());
    }, []);

    // Every user gets a separate localStorage key.
    const storageKey = userId ? `${STORAGE_KEY}-${encodeURIComponent(userId)}` : null;

    // Load only this user's custom cards.
    useEffect(() => {
        if (!storageKey) {
            setCards(defaultCards);
            return;
        }

        try {
            const saved = localStorage.getItem(storageKey);

            if (!saved) {
                setCards(defaultCards);
                return;
            }

            const parsed: unknown = JSON.parse(saved);

            if (!Array.isArray(parsed)) {
                setCards(defaultCards);
                return;
            }

            const customCards = parsed.filter(
                (item): item is AdminCard =>
                    isValidCard(item) &&
                    !defaultCards.some((defaultCard) => defaultCard.id === item.id)
            );

            setCards([...defaultCards, ...customCards]);
        } catch {
            setCards(defaultCards);
            console.error("Unable to load saved admin cards.");
        }
    }, [storageKey]);

    const persistCards = (updatedCards: AdminCard[]) => {
        if (!storageKey) {
            setError("User ID not found. Please log in again.");
            return false;
        }

        try {
            const customCards = updatedCards.filter(
                (card) => !defaultCards.some((item) => item.id === card.id)
            );

            localStorage.setItem(storageKey, JSON.stringify(customCards));
            setCards(updatedCards);
            return true;
        } catch {
            setError("Unable to save cards in localStorage.");
            return false;
        }
    };

    const openAddModal = () => {
        setEditingCard(null);
        setForm(emptyForm);
        setError("");
        setIsModalOpen(true);
    };

    const openEditModal = (card: AdminCard) => {
        setEditingCard(card);
        setForm({
            title: card.title,
            description: card.description,
            icon: card.icon,
            type: card.type,
            iconColor: card.iconColor,
            iconBg: card.iconBg,
            path: card.path,
        });
        setError("");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCard(null);
        setForm(emptyForm);
        setError("");
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!userId || !storageKey) {
            setError("User ID not found. Please log in again.");
            return;
        }

        const title = form.title.trim();
        const description = form.description.trim();
        const path = form.path.trim();

        if (!title || !description || !path) {
            setError("Please fill in all required fields.");
            return;
        }

        if (!path.startsWith("/")) {
            setError("Navigation path must start with / (example: /appointments).");
            return;
        }

        const duplicatePath = cards.some(
            (card) =>
                card.path.toLowerCase() === path.toLowerCase() &&
                card.id !== editingCard?.id
        );

        if (duplicatePath) {
            setError("A card with this navigation path already exists.");
            return;
        }

        const duplicateTitle = cards.some(
            (card) =>
                card.title.toLowerCase() === title.toLowerCase() &&
                card.id !== editingCard?.id
        );

        if (duplicateTitle) {
            setError("A card with this title already exists.");
            return;
        }

        const cardData: AdminCard = {
            id: editingCard?.id ?? crypto.randomUUID(),
            title,
            description,
            icon: form.icon,
            type: form.type,
            iconColor: form.iconColor,
            iconBg: form.iconBg,
            path,
        };

        let updatedCards: AdminCard[];

        if (editingCard) {
            updatedCards = cards.map((card) =>
                card.id === editingCard.id ? cardData : card
            );
        } else {
            updatedCards = [...cards, cardData];
        }

        if (persistCards(updatedCards)) {
            closeModal();
        }
    };

    const handleDelete = (card: AdminCard) => {
        if (defaultCards.some((item) => item.id === card.id)) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete "${card.title}"?`
        );

        if (!confirmed) return;

        persistCards(cards.filter((item) => item.id !== card.id));
    };

    const handleCardClick = (card: AdminCard) => {
        onCardClick?.(card);
    };

    const onLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(logout());
        navigate("/login", { replace: true });
    }


    if (!userId) {
        return (
            <div className="flex min-h-64 items-center justify-center p-6">
                <div className="text-center">
                    <p className="font-medium text-gray-800">
                        Login information not found.
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Please log in again to manage your cards.
                    </p>
                    <button
                        type="button"
                        onClick={onLogout}
                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <Header
                    title="Admin Management Setup"
                    titleDesc="Manage your setup cards and navigation."
                    cardButtonName="Add New Card"
                    openAddModal={openAddModal} onLogout={onLogout} />

                {/* User-specific card information */}
                <div className="mb-5 text-xs text-gray-400">
                    Custom cards are saved for the current user.
                </div>

                {/* Cards */}
                <Cards cards={cards} openEditModal={openEditModal} handleDelete={handleDelete} handleCardClick={handleCardClick} />

                {/* Add/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
                        onClick={closeModal}
                    >
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="card-modal-title"
                            className="my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
                                <h2
                                    id="card-modal-title"
                                    className="text-lg font-semibold text-gray-900"
                                >
                                    {editingCard ? "Edit Card" : "Add New Card"}
                                </h2>

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                                    aria-label="Close modal"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            {/* Card Form */}
                            < CardForm
                                handleSubmit={handleSubmit}
                                form={form}
                                setForm={setForm}
                                error={error}
                                closeModal={closeModal}
                                editingCard={editingCard}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
