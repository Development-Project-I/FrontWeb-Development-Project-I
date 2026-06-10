import type {
  ApiAula,
  CreateAulaDto,
  CreateAulaIngredientDto,
  UpdateAulaDto,
} from "../types/api";
import { apiAulas, getApiErrorMessage } from "./api";

export const aulasService = {
  async getAulas(): Promise<{ status: number; data: ApiAula[] }> {
    try {
      const response = await apiAulas().get<ApiAula[]>("/aulas");
      return { status: response.status, data: response.data };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erro ao carregar aulas."));
    }
  },

  async getAulaById(
    id: number | string,
  ): Promise<{ status: number; data: ApiAula }> {
    try {
      const response = await apiAulas().get<ApiAula>(`/aulas/${id}`);
      return { status: response.status, data: response.data };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erro ao buscar aula."));
    }
  },

  async postAula(
    data: CreateAulaDto,
  ): Promise<{ status: number; data: ApiAula }> {
    try {
      const response = await apiAulas().post<ApiAula>("/aulas", data);
      return { status: response.status, data: response.data };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erro ao criar aula."));
    }
  },

  async patchAula(
    id: number | string,
    data: UpdateAulaDto,
  ): Promise<{ status: number; data: ApiAula }> {
    try {
      const response = await apiAulas().patch<ApiAula>(`/aulas/${id}`, data);
      return { status: response.status, data: response.data };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erro ao atualizar aula."));
    }
  },

  async deleteAula(
    id: number | string,
  ): Promise<{ status: number; data: unknown }> {
    try {
      const response = await apiAulas().delete(`/aulas/${id}`);
      return { status: response.status, data: response.data };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erro ao remover aula."));
    }
  },

  async addAulaIngredient(
    aulaId: number | string,
    data: CreateAulaIngredientDto,
  ): Promise<{ status: number; data: unknown }> {
    try {
      const response = await apiAulas().post(
        `/aulas/${aulaId}/ingredientes`,
        data,
      );
      return { status: response.status, data: response.data };
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "Erro ao adicionar ingrediente à aula."),
      );
    }
  },

  async deleteIngredient(
    ingredientId: number | string,
  ): Promise<{ status: number; data: unknown }> {
    try {
      const response = await apiAulas().delete(`/ingredients/${ingredientId}`);
      return { status: response.status, data: response.data };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erro ao remover ingrediente."));
    }
  },
};
