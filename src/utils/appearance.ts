import {
  APPEARANCE_STORAGE_KEY,
  DEFAULT_APPEARANCE,
  type AppearanceSettings,
} from "../constants/appearance";

function readStoredSettings(): AppearanceSettings {
  try {
    const raw = localStorage.getItem(APPEARANCE_STORAGE_KEY);
    if (!raw) return DEFAULT_APPEARANCE;

    const parsed = JSON.parse(raw) as Partial<AppearanceSettings>;
    const colorScheme =
      parsed.colorScheme === "dark" ? "dark" : DEFAULT_APPEARANCE.colorScheme;

    return {
      colorScheme,
      accent: parsed.accent ?? DEFAULT_APPEARANCE.accent,
    };
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

export function applyAppearanceToDocument(settings: AppearanceSettings) {
  const root = document.documentElement;

  root.classList.toggle("dark", settings.colorScheme === "dark");
  root.dataset.accent = settings.accent;
  delete root.dataset.compact;
}

export function initAppearance() {
  applyAppearanceToDocument(readStoredSettings());
}
