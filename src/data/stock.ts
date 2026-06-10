import type { StockCatalogItem } from "./stock.types";
import { inventoryService } from "../services/inventory.service";
import { apiDateToBr } from "../utils/apiMappers";
import { computeExpirationMeta } from "../utils/stockRow";
import type { LessonIngredientDetail, LessonIngredientStatus } from "./lessons";
import type { StockUnit } from "../constants/inventory";

export type { StockCatalogItem } from "./stock.types";

export async function fetchStockCatalog(): Promise<StockCatalogItem[]> {
  const { data } = await inventoryService.getInventory();
  return data.map((item) => {
    const expiryBr = apiDateToBr(item.expiryDate);
    const expiration = computeExpirationMeta(expiryBr, item.quantity);
    return {
      id: String(item.id),
      name: item.name,
      category: item.category,
      unit: item.unit,
      quantity: item.quantity,
      minStock: item.minStock ?? 0,
      expirationDate: expiryBr,
      expirationLabel: expiration.expirationLabel,
      expirationTone: expiration.expirationTone,
    };
  });
}

export async function fetchInventoryItems() {
  const { data } = await inventoryService.getInventory();
  return data;
}

function resolveIngredientStatus(
  required: number,
  available: number,
): LessonIngredientStatus {
  if (available <= 0) return "SemEstoque";
  if (available < required) return "Baixo";
  return "OK";
}

export function buildLessonIngredientFromStock(
  stock: StockCatalogItem,
  required: number,
  requiredUnit: StockUnit,
): LessonIngredientDetail {
  return {
    id: crypto.randomUUID(),
    stockId: stock.id,
    name: stock.name,
    category: stock.category,
    required,
    requiredUnit,
    available: stock.quantity,
    stockUnit: stock.unit,
    status: resolveIngredientStatus(required, stock.quantity),
  };
}
