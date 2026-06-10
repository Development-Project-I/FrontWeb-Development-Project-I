import type { ExpirationTone } from "../components/Cards/StockTable";

export interface StockCatalogItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  minStock: number;
  expirationDate: string;
  expirationLabel: string;
  expirationTone: ExpirationTone;
}
