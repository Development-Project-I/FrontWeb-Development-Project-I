import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser } from "../types/auth";
import { isApiUserRole } from "../constants/apiUserRole";

const STORAGE_KEY = "gastroplan_auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.name || !parsed?.role) return null;

    return parsed;
  } catch {
    return null;
  }
}

function normalizeAuthUser(data: unknown): AuthUser | null {
  if (!data || typeof data !== "object") return null;

  const user = data as Record<string, unknown>;
  const role = user.role;

  if (typeof user.name !== "string" || !isApiUserRole(role)) {
    return null;
  }

  const accessToken =
    typeof user.accessToken === "string" ? user.accessToken : undefined;

  return {
    id: user.id as string | number,
    name: user.name,
    email: typeof user.email === "string" ? user.email : "",
    role,
    accessToken,
  };
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  const login = useCallback((nextUser: AuthUser) => {
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      logout,
    }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}

export { normalizeAuthUser };
