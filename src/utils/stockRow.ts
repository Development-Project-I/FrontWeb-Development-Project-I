import type {
  ExpirationTone,
  StockProductRow,
  StockRowStatus,
  StockRowVariant,
} from "../components/Cards/StockTable";
import type { AddStockItemPayload } from "../components/Modals/AddStockItemModal";

export function normalizeStockName(name: string): string {
  return name.trim().toLowerCase();
}

export function parseDateBr(value: string): number {
  const [d, m, y] = value.split("/").map(Number);
  return new Date(y, m - 1, d).getTime();
}

export function isoToBr(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function resolveMinStock(
  row: Pick<StockProductRow, "quantity" | "minStock">,
  fallback?: number,
): number {
  if (row.minStock != null) return row.minStock;
  if (fallback != null) return fallback;
  return Math.max(10, Math.ceil(row.quantity * 0.2));
}

export function computeStockStatus(
  quantity: number,
  minStock: number,
): StockRowStatus {
  if (quantity === 0 || quantity < minStock) return "Baixo";
  return "OK";
}

export function computeExpirationMeta(
  expirationDateBr: string,
  quantity: number,
): Pick<
  StockProductRow,
  "expirationDate" | "expirationLabel" | "expirationTone"
> {
  const [d, m, y] = expirationDateBr.split("/").map(Number);
  const exp = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  exp.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((exp.getTime() - today.getTime()) / 86_400_000);

  if (quantity === 0) {
    return {
      expirationDate: expirationDateBr,
      expirationLabel: "Em falta",
      expirationTone: "red",
    };
  }

  if (diffDays < 0) {
    return {
      expirationDate: expirationDateBr,
      expirationLabel: "Vencido",
      expirationTone: "red",
    };
  }

  if (diffDays <= 7) {
    return {
      expirationDate: expirationDateBr,
      expirationLabel: diffDays === 1 ? "1 dia" : `${diffDays} dias`,
      expirationTone: "amber",
    };
  }

  return {
    expirationDate: expirationDateBr,
    expirationLabel: `${diffDays} dias`,
    expirationTone: "green",
  };
}

export function applyRowPresentation(
  row: Omit<StockProductRow, "rowVariant" | "clockTone">,
): StockProductRow {
  const { status, expirationTone: baseTone } = row;

  let rowVariant: StockRowVariant = "default";

  if (baseTone === "red") {
    rowVariant = "expired";
  } else if (baseTone === "amber" && status === "Baixo") {
    rowVariant = "expired";
  } else if (baseTone === "amber") {
    rowVariant = "warning";
  }

  const expirationTone: ExpirationTone =
    baseTone === "amber" && status === "Baixo" ? "red" : baseTone;

  let clockTone: "red" | "amber" | undefined;
  if (rowVariant === "expired") {
    clockTone = "red";
  } else if (baseTone === "amber" && status === "OK") {
    clockTone = "amber";
  }

  return {
    ...row,
    rowVariant,
    expirationTone,
    clockTone,
  };
}

export function buildProductRow(
  partial: Omit<StockProductRow, "rowVariant" | "clockTone">,
): StockProductRow {
  const minStock = resolveMinStock(partial);
  const status = computeStockStatus(partial.quantity, minStock);
  const expiration = computeExpirationMeta(
    partial.expirationDate,
    partial.quantity,
  );

  return applyRowPresentation({
    ...partial,
    minStock,
    status,
    ...expiration,
  });
}

export function applyQuantityAndStatus(
  row: StockProductRow,
  quantity: number,
  minStock?: number,
): StockProductRow {
  const resolvedMin = minStock ?? resolveMinStock(row);
  const status = computeStockStatus(quantity, resolvedMin);
  const expiration = computeExpirationMeta(row.expirationDate, quantity);

  return applyRowPresentation({
    ...row,
    quantity,
    minStock: resolvedMin,
    status,
    ...expiration,
  });
}

export function mergeStockAddition(
  existing: StockProductRow,
  payload: AddStockItemPayload,
): StockProductRow {
  const newQuantity = existing.quantity + payload.quantity;
  const minStock = resolveMinStock(existing);
  const expirationDateBr = isoToBr(payload.expirationDate);
  const batch = payload.batch.trim() || existing.batch;
  const status = computeStockStatus(newQuantity, minStock);
  const expiration = computeExpirationMeta(expirationDateBr, newQuantity);

  return applyRowPresentation({
    ...existing,
    name: payload.name.trim(),
    category: payload.category,
    unit: payload.unit,
    quantity: newQuantity,
    minStock,
    batch,
    status,
    ...expiration,
  });
}
