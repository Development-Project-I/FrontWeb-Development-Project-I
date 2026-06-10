import { ApiUserRole } from "../constants/apiUserRole";

export { ApiUserRole };

export interface ApiInventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  expiryDate: string;
  unit: string;
  minStock: number;
  batchNumber?: string | null;
  status?: string;
}

export interface CreateInventoryDto {
  name: string;
  category: string;
  quantity: number;
  expiryDate: string;
  unit: string;
  minStock: number;
  batchNumber?: string;
}

export interface UpdateInventoryDto {
  name?: string;
  category?: string;
  quantity?: number;
  expiryDate?: string;
  unit?: string;
  minStock?: number;
  batchNumber?: string;
}

export type ApiUserStatus = "ATIVO" | "INATIVO";

export interface ApiUser {
  id: string | number;
  name: string;
  sobrenome?: string;
  email: string;
  role: ApiUserRole;
  status?: ApiUserStatus;
  lastAccess?: string;
}

export interface UpdateUserDto {
  name?: string;
  sobrenome?: string;
  email?: string;
  password?: string;
  role?: ApiUserRole;
}

export interface CreateUserDto {
  name: string;
  sobrenome: string;
  email: string;
  password: string;
  role: ApiUserRole;
}

export interface LoginDto {
  identificador: string;
  password: string;
}

export type ApiAulaStatus = "AGENDADA" | "CANCELADA" | "REALIZADA";

export type ApiStockStatus = "OK" | "BAIXO" | "SEM_ESTOQUE";

export interface ApiAulaIngredient {
  id: number;
  itemId?: number;
  quantity: number;
  unit: string;
}

export interface AulaInventoryItem {
  ingredientId: number;
  itemId: number;
  name: string;
  category: string;
  requiredQuantity: number;
  requiredUnit: string;
  availableQuantity: number;
  stockUnit: string;
  minStock?: number;
  expiryDate?: string;
  batchNumber?: string | null;
  stockStatus?: ApiStockStatus;
  itemInInventory?: boolean;
}

export interface ApiAula {
  id: number;
  name: string;
  professorId: string;
  kitchen: string;
  dayOfWeek: string;
  time: string;
  status?: ApiAulaStatus;
  inventoryItems?: AulaInventoryItem[];
  aulaIngredients?: ApiAulaIngredient[];
}

export interface CreateAulaDto {
  name: string;
  professorId: string;
  kitchen: string;
  dayOfWeek: string;
  time: string;
}

export interface UpdateAulaDto {
  name?: string;
  professorId?: string;
  kitchen?: string;
  dayOfWeek?: string;
  time?: string;
}

export interface CreateAulaIngredientDto {
  itemId: number;
  quantity: number;
  unit: string;
}
