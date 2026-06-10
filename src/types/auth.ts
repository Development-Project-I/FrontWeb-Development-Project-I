import type { ApiUserRole } from "../constants/apiUserRole";

export interface AuthUser {
  id: string | number;
  name: string;
  email: string;
  role: ApiUserRole;
  accessToken?: string;
}

export interface LoginResponse {
  message: string;
  accessToken?: string;
  user: AuthUser & { createdAt?: string };
}
