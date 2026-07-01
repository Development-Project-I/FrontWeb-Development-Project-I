import type {
  ExpirationTone,
  StockProductRow,
  StockRowStatus,
  StockRowVariant,
} from "../components/Cards/StockTable";

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

export function computeStockStatus(quantity: number): StockRowStatus {
  return quantity === 0 ? "Baixo" : "OK";
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
  partial: Omit<StockProductRow, "rowVariant" | "clockTone" | "status"> & {
    status?: StockRowStatus;
  },
): StockProductRow {
  const status = partial.status ?? computeStockStatus(partial.quantity);
  const expiration = computeExpirationMeta(
    partial.expirationDate,
    partial.quantity,
  );

  return applyRowPresentation({
    ...partial,
    status,
    ...expiration,
  });
}

export function applyQuantityAndStatus(
  row: StockProductRow,
  quantity: number,
): StockProductRow {
  const status = computeStockStatus(quantity);
  const expiration = computeExpirationMeta(row.expirationDate, quantity);

  return applyRowPresentation({
    ...row,
    quantity,
    status,
    ...expiration,
  });
}
