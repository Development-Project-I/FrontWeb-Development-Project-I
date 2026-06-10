import type {
  ApiInventoryItem,
  CreateInventoryDto,
  UpdateInventoryDto,
} from "../types/api";
import { apiInventory, getApiErrorMessage } from "./api";

export const inventoryService = {
  async getInventory(): Promise<{ status: number; data: ApiInventoryItem[] }> {
    try {
      const response = await apiInventory().get<ApiInventoryItem[]>("/inventory");
      return { status: response.status, data: response.data };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erro ao carregar estoque."));
    }
  },

  async getInventoryById(
    id: number | string,
  ): Promise<{ status: number; data: ApiInventoryItem }> {
    try {
      const response = await apiInventory().get<ApiInventoryItem>(
        `/inventory/${id}`,
      );
      return { status: response.status, data: response.data };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erro ao buscar item."));
    }
  },

  async postInventory(
    data: CreateInventoryDto,
  ): Promise<{ status: number; data: ApiInventoryItem }> {
    try {
      const response = await apiInventory().post<ApiInventoryItem>(
        "/inventory",
        data,
      );
      return { status: response.status, data: response.data };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erro ao criar item de estoque."));
    }
  },

  async patchInventory(
    id: number | string,
    data: UpdateInventoryDto,
  ): Promise<{ status: number; data: ApiInventoryItem }> {
    try {
      const response = await apiInventory().patch<ApiInventoryItem>(
        `/inventory/${id}`,
        data,
      );
      return { status: response.status, data: response.data };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erro ao atualizar item."));
    }
  },

  async deleteInventory(
    id: number | string,
  ): Promise<{ status: number; data: unknown }> {
    try {
      const response = await apiInventory().delete(`/inventory/${id}`);
      return { status: response.status, data: response.data };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erro ao remover item."));
    }
  },
};
