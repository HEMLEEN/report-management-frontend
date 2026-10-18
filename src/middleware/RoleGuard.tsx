import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles?: string[];
}

export default function RoleGuard({
    children,
    allowedRoles = [],
}: RoleGuardProps) {
    const location = useLocation();

    const login = useAppSelector(
        (state) => state.auth.login?.data
    );

    const token = login?.accessToken;
    const roles = login?.roles ?? [];

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    const hasPermission =
        allowedRoles.length === 0 ||
        allowedRoles.some((role) => roles.includes(role));

    if (!hasPermission) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}