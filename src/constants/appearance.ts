export type ColorScheme = "light" | "dark";

export type AccentColor = "blue" | "violet" | "emerald" | "rose";

export interface AppearanceSettings {
  colorScheme: ColorScheme;
  accent: AccentColor;
}

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  colorScheme: "light",
  accent: "blue",
};

export const APPEARANCE_STORAGE_KEY = "gastroplan_appearance";

export const accentOptions: {
  id: AccentColor;
  label: string;
  primary: string;
  secondary: string;
}[] = [
  { id: "blue", label: "Azul", primary: "#165dfc", secondary: "#eff6ff" },
  { id: "violet", label: "Violeta", primary: "#7c3aed", secondary: "#f5f3ff" },
  { id: "emerald", label: "Verde", primary: "#059669", secondary: "#ecfdf5" },
  { id: "rose", label: "Rosa", primary: "#e11d48", secondary: "#fff1f2" },
];

export const colorSchemeOptions: {
  id: ColorScheme;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    id: "light",
    label: "Claro",
    description: "Interface com fundo claro",
    icon: "Sun",
  },
  {
    id: "dark",
    label: "Escuro",
    description: "Modo noturno para reduzir o brilho",
    icon: "Moon",
  },
];
