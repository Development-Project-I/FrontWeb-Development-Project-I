import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  APPEARANCE_STORAGE_KEY,
  DEFAULT_APPEARANCE,
  type AppearanceSettings,
} from "../constants/appearance";
import { applyAppearanceToDocument } from "../utils/appearance";

interface AppearanceContextValue {
  settings: AppearanceSettings;
  resolvedColorScheme: "light" | "dark";
  updateSettings: (next: AppearanceSettings) => void;
  resetSettings: () => void;
}

const AppearanceContext = createContext<AppearanceContextValue | undefined>(
  undefined,
);

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

interface AppearanceProviderProps {
  children: ReactNode;
}

export function AppearanceProvider({ children }: AppearanceProviderProps) {
  const [settings, setSettings] = useState<AppearanceSettings>(() =>
    readStoredSettings(),
  );
  const [resolvedColorScheme, setResolvedColorScheme] = useState<
    "light" | "dark"
  >(() => readStoredSettings().colorScheme);

  const persist = useCallback((next: AppearanceSettings) => {
    setSettings(next);
    setResolvedColorScheme(next.colorScheme);
    applyAppearanceToDocument(next);
    localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(next));
  }, []);

  useEffect(() => {
    applyAppearanceToDocument(settings);
    setResolvedColorScheme(settings.colorScheme);
  }, [settings]);

  const updateSettings = useCallback(
    (next: AppearanceSettings) => {
      persist(next);
    },
    [persist],
  );

  const resetSettings = useCallback(() => {
    persist(DEFAULT_APPEARANCE);
  }, [persist]);

  const value = useMemo(
    () => ({
      settings,
      resolvedColorScheme,
      updateSettings,
      resetSettings,
    }),
    [settings, resolvedColorScheme, updateSettings, resetSettings],
  );

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance(): AppearanceContextValue {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error(
      "useAppearance deve ser usado dentro de AppearanceProvider",
    );
  }
  return context;
}
