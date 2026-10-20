export const ROLE_HOME: Record<string, string> = {
    SA: "/setup",
    ASC: "/setup",
    ADMIN: "/workspace",
    HR: "/departments",
    USER: "/dashboard",
};

export const getRoleHome = (roles: string[]): string => {

    const rolePriority = ["SA", "ASC", "ADMIN", "HR", "USER"];

    const matchedRole = rolePriority.find((role) =>
        roles.includes(role)
    );

    return matchedRole ? ROLE_HOME[matchedRole] : "/unauthorized";
};