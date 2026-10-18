export const UserStatus = {
  ACTIVE: "A",
  INACTIVE: "I",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];