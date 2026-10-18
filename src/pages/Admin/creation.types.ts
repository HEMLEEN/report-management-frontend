export type CreationType =
    | "user"
    | "reportMode"
    | "category"
    | "company";

export interface CreationRecord {
    id: string;
    name: string;
}

export interface CreationFormValues {
    name: string;
}

export const creationLabels: Record<CreationType, string> = {
    user: "User",
    reportMode: "Report Mode",
    category: "Category",
    company: "Company",
};