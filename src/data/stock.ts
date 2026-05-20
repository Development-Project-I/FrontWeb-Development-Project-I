import type { ExpirationTone } from "../components/Cards/StockTable";
import type { StockProductRow } from "../components/Cards/StockTable";
import {
  applyRowPresentation,
  computeExpirationMeta,
  computeStockStatus,
  resolveMinStock,
} from "../utils/stockRow";
import type { StockUnit } from "../constants/inventory";
import type { LessonIngredientDetail, LessonIngredientStatus } from "./lessons";

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

const rawStock: StockProductRow[] = [
  {
    id: "1",
    name: "Açúcar",
    unit: "kg",
    category: "Farináceos",
    batch: "AC2024-101",
    quantity: 200,
    minStock: 40,
    expirationDate: "09/03/2027",
    expirationLabel: "",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "2",
    name: "Alho",
    unit: "kg",
    category: "Temperos",
    batch: "TP2024-033",
    quantity: 15,
    minStock: 20,
    expirationDate: "24/04/2026",
    expirationLabel: "",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "3",
    name: "Azeite Extra Virgem",
    unit: "L",
    category: "Óleos",
    batch: "AZ2024-012",
    quantity: 45,
    minStock: 10,
    expirationDate: "14/01/2027",
    expirationLabel: "",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "4",
    name: "Batata",
    unit: "kg",
    category: "Vegetais",
    batch: "VG2024-189",
    quantity: 90,
    minStock: 30,
    expirationDate: "04/05/2026",
    expirationLabel: "",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "5",
    name: "Cebola",
    unit: "kg",
    category: "Vegetais",
    batch: "VG2024-157",
    quantity: 120,
    minStock: 25,
    expirationDate: "21/05/2026",
    expirationLabel: "",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "6",
    name: "Creme de Leite",
    unit: "L",
    category: "Laticínios",
    batch: "LT2024-044",
    quantity: 8,
    minStock: 15,
    expirationDate: "18/04/2026",
    expirationLabel: "",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "7",
    name: "Filé Mignon",
    unit: "kg",
    category: "Carnes",
    batch: "CR2024-221",
    quantity: 8,
    minStock: 12,
    expirationDate: "20/04/2026",
    expirationLabel: "",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "8",
    name: "Frango",
    unit: "kg",
    category: "Carnes",
    batch: "CR2024-198",
    quantity: 25,
    minStock: 15,
    expirationDate: "22/04/2026",
    expirationLabel: "",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "9",
    name: "Farinha de Trigo",
    unit: "kg",
    category: "Farináceos",
    batch: "AC2024-102",
    quantity: 150,
    minStock: 30,
    expirationDate: "10/08/2026",
    expirationLabel: "",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "10",
    name: "Leite Integral",
    unit: "L",
    category: "Laticínios",
    batch: "LT2024-031",
    quantity: 60,
    minStock: 20,
    expirationDate: "25/05/2026",
    expirationLabel: "",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "11",
    name: "Manteiga",
    unit: "kg",
    category: "Laticínios",
    batch: "LT2024-055",
    quantity: 30,
    minStock: 10,
    expirationDate: "30/06/2026",
    expirationLabel: "",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "12",
    name: "Ovos",
    unit: "dúzia",
    category: "Laticínios",
    batch: "OV2024-128",
    quantity: 0,
    minStock: 10,
    expirationDate: "20/05/2026",
    expirationLabel: "",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "13",
    name: "Pimenta do Reino",
    unit: "kg",
    category: "Temperos",
    batch: "TP2024-041",
    quantity: 5,
    minStock: 10,
    expirationDate: "15/12/2026",
    expirationLabel: "",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "14",
    name: "Sal",
    unit: "kg",
    category: "Temperos",
    batch: "TP2024-001",
    quantity: 80,
    minStock: 15,
    expirationDate: "01/01/2028",
    expirationLabel: "",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "15",
    name: "Tomate",
    unit: "kg",
    category: "Vegetais",
    batch: "VG2024-142",
    quantity: 0,
    minStock: 20,
    expirationDate: "19/05/2026",
    expirationLabel: "",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "16",
    name: "Vinagre",
    unit: "L",
    category: "Temperos",
    batch: "TP2024-019",
    quantity: 22,
    minStock: 8,
    expirationDate: "03/09/2026",
    expirationLabel: "",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "17",
    name: "Óleo de Soja",
    unit: "L",
    category: "Óleos",
    batch: "AZ2024-008",
    quantity: 18,
    minStock: 12,
    expirationDate: "12/05/2026",
    expirationLabel: "",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "18",
    name: "Queijo Mussarela",
    unit: "kg",
    category: "Laticínios",
    batch: "LT2024-077",
    quantity: 14,
    minStock: 10,
    expirationDate: "28/04/2026",
    expirationLabel: "",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
];

function normalizeCatalogRow(row: StockProductRow): StockCatalogItem {
  const minStock = resolveMinStock(row);
  const expiration = computeExpirationMeta(row.expirationDate, row.quantity);
  const status = computeStockStatus(row.quantity, minStock);
  const presented = applyRowPresentation({
    ...row,
    minStock,
    status,
    ...expiration,
  });

  return {
    id: presented.id,
    name: presented.name,
    category: presented.category,
    unit: presented.unit,
    quantity: presented.quantity,
    minStock,
    expirationDate: presented.expirationDate,
    expirationLabel: presented.expirationLabel,
    expirationTone: presented.expirationTone,
  };
}

const stockCatalog = rawStock.map(normalizeCatalogRow);

export function getStockCatalog(): StockCatalogItem[] {
  return stockCatalog;
}

export function getStockItemById(id: string): StockCatalogItem | undefined {
  return stockCatalog.find((item) => item.id === id);
}

export function resolveLessonIngredientStatus(
  stock: StockCatalogItem,
  required: number,
  requiredUnit: string,
): LessonIngredientStatus {
  if (stock.quantity <= 0) return "SemEstoque";

  if (requiredUnit === stock.unit && stock.quantity < required) {
    return "Baixo";
  }

  return "OK";
}

export function buildLessonIngredientFromStock(
  stock: StockCatalogItem,
  required: number,
  requiredUnit: StockUnit,
): LessonIngredientDetail {
  return {
    id: `li-${stock.id}-${crypto.randomUUID()}`,
    stockId: stock.id,
    name: stock.name,
    category: stock.category,
    required,
    requiredUnit,
    available: stock.quantity,
    stockUnit: stock.unit,
    status: resolveLessonIngredientStatus(stock, required, requiredUnit),
  };
}
