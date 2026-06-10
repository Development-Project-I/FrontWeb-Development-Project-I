export type ApiUserRole = "ADMIN" | "ESTOQUISTA" | "PROFESSOR";

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

export interface ApiUser {
  id: string;
  name: string;
  sobrenome?: string;
  email: string;
  role: ApiUserRole;
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

export interface ApiAulaIngredient {
  id: number;
  itemId?: number;
  quantity: number;
  unit: string;
}

export interface ApiAula {
  id: number;
  name: string;
  professorId: string;
  kitchen: string;
  dayOfWeek: string;
  time: string;
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
