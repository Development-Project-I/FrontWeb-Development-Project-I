export const USER_ROLES = ["Estoquista", "Professor", "Administrador"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ["Ativo", "Inativo"] as const;

export type UserStatus = (typeof USER_STATUSES)[number];
