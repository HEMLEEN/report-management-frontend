import { LucideIcon, UserRoundPlus, FilePlus2, Tags, Building2, BriefcaseBusiness, FileText, Folder, Settings, Home } from "lucide-react";
import { SelectOption, FormValues } from "./types";

export const iconMap: Record<string, LucideIcon> = {
    UserRoundPlus,
    FilePlus2,
    Tags,
    Building2,
    BriefcaseBusiness,
    FileText,
    Folder,
    Settings,
    Home
};

export const iconOptions: SelectOption[] = Object.keys(iconMap).map((icon) => ({
    value: icon,
    label: icon,
}));

export const colorOptions: SelectOption[] = [
    { value: "text-blue-600", label: "Blue" },
    { value: "text-purple-600", label: "Purple" },
    { value: "text-green-600", label: "Green" },
    { value: "text-orange-600", label: "Orange" },
    { value: "text-red-600", label: "Red" },
    { value: "text-pink-600", label: "Pink" },
    { value: "text-indigo-600", label: "Indigo" },
    { value: "text-teal-600", label: "Teal" },
];

export const backgroundOptions: SelectOption[] = [
    { value: "bg-blue-100", label: "Blue background" },
    { value: "bg-purple-100", label: "Purple background" },
    { value: "bg-green-100", label: "Green background" },
    { value: "bg-orange-100", label: "Orange background" },
    { value: "bg-red-100", label: "Red background" },
    { value: "bg-pink-100", label: "Pink background" },
    { value: "bg-indigo-100", label: "Indigo background" },
    { value: "bg-teal-100", label: "Teal background" },
];

export const typeOptions: SelectOption[] = [
    { value: "user", label: "User" },
    { value: "reportMode", label: "Report Mode" },
    { value: "category", label: "Category" },
    { value: "company", label: "Company" },
    { value: "custom", label: "Custom" },
];

export const emptyForm: FormValues = {
    title: "",
    description: "",
    icon: "Folder",
    type: "custom",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
    path: "",
};