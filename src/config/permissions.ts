import { ApiUserRole } from "../constants/apiUserRole";

export const DEFAULT_HOME = "/dashboard";

export function getHomeRoute(_role: ApiUserRole): string {
  return DEFAULT_HOME;
}

export function canAccessRoute(role: ApiUserRole, pathname: string): boolean {
  if (role === ApiUserRole.ADMIN) return true;

  if (role === ApiUserRole.ESTOQUISTA) {
    return (
      pathname === "/dashboard" ||
      pathname === "/estoque" ||
      pathname === "/relatorios" ||
      pathname === "/configuracoes"
    );
  }

  if (role === ApiUserRole.PROFESSOR) {
    return (
      pathname === "/dashboard" ||
      pathname === "/relatorios" ||
      pathname === "/configuracoes" ||
      pathname.startsWith("/planejamento-aulas")
    );
  }

  return false;
}

export function canAccessNavItem(
  role: ApiUserRole,
  allowedRoles: readonly ApiUserRole[],
): boolean {
  return allowedRoles.includes(role);
}
