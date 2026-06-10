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
import type {
  ApiAula,
  ApiAulaIngredient,
  ApiInventoryItem,
  ApiUser,
  ApiUserRole,
} from "../types/api";
import type { AccessType } from "../components/Modals/CreateUserModal";
import type { UserRole } from "../constants/users";
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
      return "ADMIN";
    case "estoque":
      return "ESTOQUISTA";
    case "professor":
      return "PROFESSOR";
  }
}

export function apiRoleToUserRole(role: ApiUserRole): UserRole {
  switch (role) {
    case "ADMIN":
      return "Administrador";
    case "ESTOQUISTA":
      return "Estoquista";
    case "PROFESSOR":
      return "Professor";
  }
}

function mapInventoryStatus(
  item: ApiInventoryItem,
): StockProductRow["status"] {
  const min = item.minStock ?? 0;
  if (item.quantity === 0 || item.quantity < min) return "Baixo";
  if (item.status?.toLowerCase().includes("baixo")) return "Baixo";
  return "OK";
}

export function mapInventoryToStockRow(item: ApiInventoryItem): StockProductRow {
  const expiryBr = apiDateToBr(item.expiryDate);
  const minStock = item.minStock ?? 0;
  const expiration = computeExpirationMeta(expiryBr, item.quantity);

  return applyRowPresentation({
    id: String(item.id),
    name: item.name,
    unit: item.unit,
    category: item.category,
    batch: item.batchNumber?.trim() || "—",
    quantity: item.quantity,
    minStock,
    status: mapInventoryStatus(item),
    ...expiration,
  });
}

export function mapApiUserToRow(user: ApiUser): UserListRow {
  const fullName = [user.name, user.sobrenome].filter(Boolean).join(" ").trim();
  return {
    id: user.id,
    name: fullName || user.name,
    email: user.email,
    role: apiRoleToUserRole(user.role),
    status: "Ativo",
    lastAccess: "—",
  };
}

export function mapApiUserToTeacher(user: ApiUser): Teacher {
  const fullName = [user.name, user.sobrenome].filter(Boolean).join(" ").trim();
  return {
    id: user.id,
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
  inventory: ApiInventoryItem[],
  professorName?: string,
): ScheduledLesson {
  const day = apiDayToWeekDay(aula.dayOfWeek);
  const ingredients = mapAulaIngredients(aula.aulaIngredients, inventory);

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
  inventory: ApiInventoryItem[],
  professorName?: string,
): LessonDetail {
  const day = apiDayToWeekDay(aula.dayOfWeek);
  const ingredients = mapAulaIngredients(aula.aulaIngredients, inventory);

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
