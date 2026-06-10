/** Perfis retornados pelo backend (`POST /auth/login`, `GET /users`, etc.). */
export const ApiUserRole = {
  ADMIN: "ADMIN",
  ESTOQUISTA: "ESTOQUISTA",
  PROFESSOR: "PROFESSOR",
} as const;

export type ApiUserRole = (typeof ApiUserRole)[keyof typeof ApiUserRole];

export const API_USER_ROLES = Object.values(ApiUserRole) as ApiUserRole[];

export function isApiUserRole(value: unknown): value is ApiUserRole {
  return API_USER_ROLES.includes(value as ApiUserRole);
}
