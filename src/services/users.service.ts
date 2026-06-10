import type { ApiUser, CreateUserDto, UpdateUserDto } from "../types/api";
import { apiUsers, getApiErrorMessage } from "./api";

function parseUsersResponse(data: unknown): ApiUser[] {
  if (Array.isArray(data)) return data as ApiUser[];
  return [];
}

export const usersService = {
  async getUsers(): Promise<{ status: number; data: ApiUser[] }> {
    try {
      const response = await apiUsers().get("/users");
      return {
        status: response.status,
        data: parseUsersResponse(response.data),
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erro ao carregar usuários."));
    }
  },

  async registerUser(
    data: CreateUserDto,
  ): Promise<{ status: number; data: ApiUser }> {
    try {
      const response = await apiUsers().post<ApiUser>("/users/register", data);
      return { status: response.status, data: response.data };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erro ao cadastrar usuário."));
    }
  },

  async getUserById(
    id: string,
  ): Promise<{ status: number; data: ApiUser }> {
    try {
      const response = await apiUsers().get<ApiUser>(`/users/${id}`);
      return { status: response.status, data: response.data };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erro ao buscar usuário."));
    }
  },

  async patchUser(
    id: string,
    data: UpdateUserDto,
  ): Promise<{ status: number; data: ApiUser }> {
    try {
      const response = await apiUsers().patch<ApiUser>(`/users/${id}`, data);
      return { status: response.status, data: response.data };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erro ao atualizar usuário."));
    }
  },

  async deleteUser(id: string): Promise<{ status: number; data: unknown }> {
    try {
      const response = await apiUsers().delete(`/users/${id}`);
      return { status: response.status, data: response.data };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erro ao remover usuário."));
    }
  },
};
