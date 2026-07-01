import type { UserListRow } from "../components/Cards/UsersTable";
import type { Teacher } from "../components/Cards/TeacherCard";
import type { StockProductRow } from "../components/Cards/StockTable";
import type { LessonIngredient } from "../components/Cards/LessonIngredientItem";
import type {
  LessonDetail,
  LessonIngredientDetail,
  LessonIngredientStatus,
  ScheduledLesson,
  WeekDayKey,
} from "../data/lessons";
import { ApiUserRole } from "../constants/apiUserRole";
import type {
  ApiAula,
  ApiAulaIngredient,
  ApiInventoryItem,
  ApiStockStatus,
  ApiUser,
  AulaInventoryItem,
} from "../types/api";
import type { AccessType } from "../components/Modals/CreateUserModal";
import type { AuthUser } from "../types/auth";
import type { UserRole, UserStatus } from "../constants/users";
import type { ClassSlotAccent } from "../components/Cards/WeeklyCalendar/ClassSlotCard";
import {
  applyRowPresentation,
  computeExpirationMeta,
  isoToBr,
} from "./stockRow";

const DAY_TO_API: Record<WeekDayKey, string> = {
  segunda: "Segunda",
  terca: "Terça",
  quarta: "Quarta",
  quinta: "Quinta",
  sexta: "Sexta",
};

const API_TO_DAY: Record<string, WeekDayKey> = {
  Segunda: "segunda",
  Terça: "terca",
  Quarta: "quarta",
  Quinta: "quinta",
  Sexta: "sexta",
};

export function weekDayToApi(day: WeekDayKey): string {
  return DAY_TO_API[day];
}

export function apiDayToWeekDay(dayOfWeek: string): WeekDayKey {
  return API_TO_DAY[dayOfWeek] ?? "segunda";
}

export function apiDateToIso(date: string): string {
  if (date.includes("T")) return date.split("T")[0] ?? date;
  return date;
}

export function apiDateToBr(date: string): string {
  return isoToBr(apiDateToIso(date));
}

export function accessTypeToApiRole(type: AccessType): ApiUserRole {
  switch (type) {
    case "admin":
      return ApiUserRole.ADMIN;
    case "estoque":
      return ApiUserRole.ESTOQUISTA;
    case "professor":
      return ApiUserRole.PROFESSOR;
  }
}

export function apiRoleToUserRole(role: ApiUserRole): UserRole {
  switch (role) {
    case ApiUserRole.ADMIN:
      return "Administrador";
    case ApiUserRole.ESTOQUISTA:
      return "Estoquista";
    case ApiUserRole.PROFESSOR:
      return "Professor";
  }
}

export function userRoleToAccessType(role: UserRole): AccessType {
  switch (role) {
    case "Administrador":
      return "admin";
    case "Estoquista":
      return "estoque";
    case "Professor":
      return "professor";
  }
}

function mapInventoryStatus(
  item: ApiInventoryItem,
): StockProductRow["status"] {
  if (item.quantity === 0) return "Baixo";
  if (item.status?.toLowerCase().includes("baixo")) return "Baixo";
  return "OK";
}

export function mapInventoryToStockRow(item: ApiInventoryItem): StockProductRow {
  const expiryBr = apiDateToBr(item.expiryDate);
  const expiration = computeExpirationMeta(expiryBr, item.quantity);

  return applyRowPresentation({
    id: String(item.id),
    name: item.name,
    unit: item.unit,
    category: item.category,
    quantity: item.quantity,
    status: mapInventoryStatus(item),
    ...expiration,
  });
}

function formatLastAccess(value: string | undefined): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function mapApiUserStatus(status: string | undefined): UserStatus {
  if (status?.toUpperCase() === "INATIVO") return "Inativo";
  return "Ativo";
}

export function mapApiUserToRow(user: ApiUser): UserListRow {
  const fullName = [user.name, user.sobrenome].filter(Boolean).join(" ").trim();
  return {
    id: String(user.id),
    name: fullName || user.name,
    firstName: user.name,
    lastName: user.sobrenome ?? "",
    email: user.email,
    role: apiRoleToUserRole(user.role),
    status: mapApiUserStatus(user.status),
    lastAccess: formatLastAccess(user.lastAccess),
  };
}

export function mapApiUserToAuthUser(
  user: ApiUser,
  accessToken?: string,
): AuthUser {
  const fullName = [user.name, user.sobrenome].filter(Boolean).join(" ").trim();
  return {
    id: user.id,
    name: fullName || user.name,
    email: user.email,
    role: user.role,
    accessToken,
  };
}

export function mapApiUserToTeacher(user: ApiUser): Teacher {
  const fullName = [user.name, user.sobrenome].filter(Boolean).join(" ").trim();
  return {
    id: String(user.id),
    name: fullName || user.name,
    email: user.email,
    phone: "—",
    specialties: ["Gastronomia"],
  };
}

function endTime(start: string): string {
  const [h] = start.split(":").map(Number);
  return `${String((h ?? 0) + 2).padStart(2, "0")}:00`;
}

function ingredientAccent(
  ingredients: LessonIngredientDetail[],
): ClassSlotAccent {
  if (ingredients.some((item) => item.status === "SemEstoque")) return "red";
  if (ingredients.some((item) => item.status === "Baixo")) return "amber";
  return "blue";
}

function resolveIngredientStatus(
  required: number,
  available: number,
): LessonIngredientStatus {
  if (available <= 0) return "SemEstoque";
  if (available < required) return "Baixo";
  return "OK";
}

function mapStockStatusToLessonStatus(
  stockStatus: ApiStockStatus | undefined,
  required: number,
  available: number,
): LessonIngredientStatus {
  if (stockStatus === "SEM_ESTOQUE") return "SemEstoque";
  if (stockStatus === "BAIXO") return "Baixo";
  if (stockStatus === "OK") return "OK";
  return resolveIngredientStatus(required, available);
}

export function mapInventoryItems(
  items: AulaInventoryItem[],
): LessonIngredientDetail[] {
  return items.map((item) => ({
    id: String(item.ingredientId),
    stockId: item.itemInInventory === false ? undefined : String(item.itemId),
    name: item.name,
    category: item.category,
    required: item.requiredQuantity,
    requiredUnit: item.requiredUnit,
    available: item.availableQuantity,
    stockUnit: item.stockUnit,
    status: mapStockStatusToLessonStatus(
      item.stockStatus,
      item.requiredQuantity,
      item.availableQuantity,
    ),
  }));
}

export function isAulaCancelled(aula: ApiAula): boolean {
  return aula.status === "CANCELADA";
}

export function resolveLessonIngredients(
  aula: ApiAula,
  inventory: ApiInventoryItem[] = [],
): LessonIngredientDetail[] {
  if (aula.inventoryItems?.length) {
    return mapInventoryItems(aula.inventoryItems);
  }
  return mapAulaIngredients(aula.aulaIngredients, inventory);
}

export function aulaNeedsInventoryFallback(aulas: ApiAula[]): boolean {
  return aulas.some(
    (aula) =>
      !aula.inventoryItems?.length && Boolean(aula.aulaIngredients?.length),
  );
}

export function mapIngredientToNextLessonCard(
  ingredient: LessonIngredientDetail,
): LessonIngredient {
  const unit = ingredient.requiredUnit || ingredient.stockUnit;
  let status: LessonIngredient["status"] = "OK";
  if (ingredient.status === "SemEstoque") status = "Esgotado";
  else if (ingredient.status === "Baixo") status = "Baixo";

  return {
    id: ingredient.id,
    name: unit ? `${ingredient.name} (${unit})` : ingredient.name,
    required: ingredient.required,
    available: ingredient.available,
    status,
  };
}

export function mapAulaIngredients(
  apiIngredients: ApiAulaIngredient[] | undefined,
  inventory: ApiInventoryItem[],
): LessonIngredientDetail[] {
  if (!apiIngredients?.length) return [];

  return apiIngredients.map((ingredient) => {
    const itemId = ingredient.itemId ?? ingredient.id;
    const stock = inventory.find((item) => item.id === itemId);
    const available = stock?.quantity ?? 0;
    const stockUnit = stock?.unit ?? ingredient.unit;

    return {
      id: String(ingredient.id),
      stockId: stock ? String(stock.id) : undefined,
      name: stock?.name ?? `Item #${itemId}`,
      category: stock?.category ?? "—",
      required: ingredient.quantity,
      requiredUnit: ingredient.unit,
      available,
      stockUnit,
      status: resolveIngredientStatus(ingredient.quantity, available),
    };
  });
}

export function mapApiAulaToScheduledLesson(
  aula: ApiAula,
  inventory: ApiInventoryItem[] = [],
  professorName?: string,
): ScheduledLesson {
  const day = apiDayToWeekDay(aula.dayOfWeek);
  const ingredients = resolveLessonIngredients(aula, inventory);

  return {
    id: String(aula.id),
    title: aula.name,
    instructor: professorName ?? aula.professorId,
    location: aula.kitchen,
    day,
    startTime: aula.time,
    accent: ingredientAccent(ingredients),
    hasNoIngredients: ingredients.length === 0,
  };
}

export function mapApiAulaToLessonDetail(
  aula: ApiAula,
  inventory: ApiInventoryItem[] = [],
  professorName?: string,
): LessonDetail {
  const day = apiDayToWeekDay(aula.dayOfWeek);
  const ingredients = resolveLessonIngredients(aula, inventory);

  return {
    id: String(aula.id),
    title: aula.name,
    titleFull: aula.name,
    instructor: professorName ?? aula.professorId,
    location: aula.kitchen,
    day,
    dayLabel: aula.dayOfWeek,
    startTime: aula.time,
    timeRange: `${aula.time} - ${endTime(aula.time)}`,
    accent: ingredientAccent(ingredients),
    ingredients,
  };
}
