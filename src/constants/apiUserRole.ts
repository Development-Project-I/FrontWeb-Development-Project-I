/** Perfis retornados pelo backend (`POST /auth/login`, `GET /users`, etc.). */
export enum ApiUserRole {
  ADMIN = "ADMIN",
  ESTOQUISTA = "ESTOQUISTA",
  PROFESSOR = "PROFESSOR",
}

export const API_USER_ROLES = Object.values(ApiUserRole) as ApiUserRole[];

export function isApiUserRole(value: unknown): value is ApiUserRole {
  return API_USER_ROLES.includes(value as ApiUserRole);
}
