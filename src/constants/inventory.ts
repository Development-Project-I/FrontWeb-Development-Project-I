export const STOCK_CATEGORIES = [
  "Farináceos",
  "Temperos",
  "Óleos",
  "Vegetais",
  "Laticínios",
  "Carnes",
] as const;

export type StockCategory = (typeof STOCK_CATEGORIES)[number];

export const STOCK_UNITS = [
  "kg",
  "g",
  "L",
  "mL",
  "unidade",
  "dúzia",
  "caixa",
  "pacote",
  "lata",
  "garrafa",
] as const;

export type StockUnit = (typeof STOCK_UNITS)[number];
