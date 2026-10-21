export const UserStatus = {
  ACTIVE: "A",
  INACTIVE: "I",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const UserRoles = {
  SA: "SA",       // Super Admin
  ASC: "ASC",     // Admin/setup access
  ADMIN: "A",
  HR: "HR",
  USER: "USER"
} as const;


export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];