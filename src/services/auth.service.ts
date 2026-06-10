import type { LoginDto } from "../types/api";
import type { LoginResponse } from "../types/auth";
import { apiAuth, getApiErrorMessage } from "./api";

export const authService = {
  async postLogin(
    loginData: LoginDto,
  ): Promise<{ status: number; data: LoginResponse }> {
    try {
      const response = await apiAuth().post<LoginResponse>(
        "/auth/login",
        loginData,
      );
      return { status: response.status, data: response.data };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "E-mail ou senha incorretos."));
    }
  },
};
