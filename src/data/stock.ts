import type { StockCatalogItem } from "./stock.types";
import { inventoryService } from "../services/inventory.service";
import { apiDateToBr } from "../utils/apiMappers";
import { computeExpirationMeta } from "../utils/stockRow";
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
