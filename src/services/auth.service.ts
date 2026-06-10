import type { LoginDto } from "../types/api";
import { apiAuth, getApiErrorMessage } from "./api";

export const authService = {
  async postLogin(
    loginData: LoginDto,
  ): Promise<{ status: number; data: unknown }> {
    try {
      const response = await apiAuth().post("/auth/login", loginData);
      return { status: response.status, data: response.data };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "E-mail ou senha incorretos."));
    }
  },
};
