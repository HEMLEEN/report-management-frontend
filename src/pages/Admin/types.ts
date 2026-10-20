export interface AdminCard {
    id: string;
    title: string;
    description: string;
    icon: string;
    type: string;
    iconColor: string;
    iconBg: string;
    path: string;
}

export interface FormValues {
    title: string;
    description: string;
    icon: string;
    type: string;
    iconColor: string;
    iconBg: string;
    path: string;
}

export interface AdminSetupProps {
    onCardClick?: (card: AdminCard) => void;
}

export interface SelectOption {
    value: string;
    label: string;
}

export const STORAGE_KEY = "report-management-admin-cards";
export const LOGIN_KEY = "login";

export const defaultCards: AdminCard[] = [
    {
        id: "user",
        title: "User",
        description: "Register and manage users.",
        icon: "UserRoundPlus",
        type: "user",
        iconColor: "text-blue-600",
        iconBg: "bg-blue-100",
        path: "/user",
    },
    {
        id: "reportMode",
        title: "Report Mode",
        description: "Create and manage report modes.",
        icon: "FilePlus2",
        type: "reportMode",
        iconColor: "text-purple-600",
        iconBg: "bg-purple-100",
        path: "/reportMode",
    },
    {
        id: "category",
        title: "Category",
        description: "Organize report categories.",
        icon: "Tags",
        type: "category",
        iconColor: "text-green-600",
        iconBg: "bg-green-100",
        path: "/category",
    },
    {
        id: "company",
        title: "Company",
        description: "Register and manage companies.",
        icon: "Building2",
        type: "company",
        iconColor: "text-orange-600",
        iconBg: "bg-orange-100",
        path: "/company",
    },
    {
        id: "workspace",
        title: "WorkSpace",
        description: "Manage you workspace.",
        icon: "Building2",
        type: "workspace",
        iconColor: "text-orange-600",
        iconBg: "bg-orange-100",
        path: "/admin/workspace",
    },
    {
        id: "dashboard",
        title: "Dashboard",
        description: "Mange your Dashboard.",
        icon: "Building2",
        type: "dashboard",
        iconColor: "text-orange-600",
        iconBg: "bg-orange-100",
        path: "/dashboard",
    },
];