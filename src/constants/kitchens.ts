export const KITCHENS = [
  "Cozinha A",
  "Cozinha B",
  "Cozinha C",
  "Cozinha D",
  "Cozinha E",
] as const;

export type Kitchen = (typeof KITCHENS)[number];
