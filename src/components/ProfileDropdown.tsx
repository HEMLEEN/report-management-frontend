import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, UserRound, LogOut } from "lucide-react";
import { useAppDispatch } from "../redux/hooks";
import { logout } from "../redux/slices/auth/loginSlice";

interface User {
    name?: string;
}

interface ProfileMenuItem {
    label: string;
    icon: typeof UserRound;
    action: () => void;
}

interface Props {
    user?: User;
}

const ProfileDropdown = ({ user }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // Clear Redux authentication state
        dispatch(logout());

        // Redirect to login
        navigate("/login", { replace: true });
    };

    // Dynamic dropdown menu items
    const menuItems: ProfileMenuItem[] = [
        {
            label: "Profile",
            icon: UserRound,
            action: () => {
                setIsOpen(false);
                navigate("/profile", {
                    state: { user },
                });
            },
        },
        {
            label: "Logout",
            icon: LogOut,
            action: handleLogout,
        },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Avatar */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full p-1 transition hover:bg-gray-100"
                aria-expanded={isOpen}
                aria-haspopup="menu"
            >
                <div className="grid h-9 w-9 place-items-center rounded-full bg-brand/10 font-semibold text-brand">
                    {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                </div>

                <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* Dynamic Dropdown */}
            {isOpen && (
                <div
                    role="menu"
                    className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-lg"
                >
                    {/* User Information */}
                    <div className="border-b border-gray-100 px-4 py-2">
                        <p className="truncate text-sm font-semibold text-gray-800">
                            {user?.name ?? "User"}
                        </p>
                        <p className="text-xs text-gray-500">Account</p>
                    </div>

                    {/* Dynamic Menu Items */}
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.label}
                                type="button"
                                role="menuitem"
                                onClick={item.action}
                                className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-gray-50 ${item.label === "Logout"
                                    ? "text-red-600 hover:bg-red-50"
                                    : "text-gray-700"
                                    }`}
                            >
                                <Icon size={16} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;