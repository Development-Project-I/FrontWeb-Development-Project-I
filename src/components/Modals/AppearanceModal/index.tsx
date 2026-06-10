import clsx from "clsx";
import { useCallback, useEffect, useId, useState, type FormEvent } from "react";
import {
  accentOptions,
  colorSchemeOptions,
  type AppearanceSettings,
} from "../../../constants/appearance";
import { Button } from "../../Button";
import { Icon } from "../../Icon";

export interface AppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSettings: AppearanceSettings;
  onSave?: (settings: AppearanceSettings) => void | Promise<void>;
}

export function AppearanceModal({
  isOpen,
  onClose,
  initialSettings,
  onSave,
}: AppearanceModalProps) {
  const baseId = useId();
  const [settings, setSettings] = useState<AppearanceSettings>(initialSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = useCallback(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave?.(settings);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-neutral-950/85 backdrop-blur-[1px]"
        aria-label="Fechar modal"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${baseId}-title`}
        className="relative z-[101] flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
        onClick={(ev) => ev.stopPropagation()}
      >
        <header className="shrink-0 border-b border-neutral-200 px-6 pb-4 pt-6 dark:border-slate-700">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/50">
                <Icon
                  name="Palette"
                  color="text-purple-600 dark:text-purple-400"
                  className="size-6"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>
              <div className="min-w-0">
                <h2
                  id={`${baseId}-title`}
                  className="preset-headline_20/25 font-bold text-neutral-900 dark:text-slate-100"
                >
                  Aparência
                </h2>
                <p className="preset-body_14/20 mt-1 text-neutral-500 dark:text-slate-400">
                  Personalize o visual da aplicação
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="Fechar"
            >
              <Icon name="X" className="size-5" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="space-y-6 px-6 py-5">
            <fieldset>
              <legend className="preset-body_14/20 mb-3 font-medium text-neutral-800 dark:text-slate-200">
                Tema
              </legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {colorSchemeOptions.map((option) => (
                  <label
                    key={option.id}
                    className={clsx(
                      "flex cursor-pointer flex-col rounded-xl border p-3 transition-colors",
                      settings.colorScheme === option.id
                        ? "border-primary bg-secondary"
                        : "border-neutral-200 hover:border-neutral-300 dark:border-slate-600 dark:hover:border-slate-500",
                    )}
                  >
                    <input
                      type="radio"
                      name={`${baseId}-scheme`}
                      value={option.id}
                      checked={settings.colorScheme === option.id}
                      onChange={() =>
                        setSettings((prev) => ({
                          ...prev,
                          colorScheme: option.id,
                        }))
                      }
                      className="sr-only"
                    />
                    <span className="mb-2 flex size-8 items-center justify-center rounded-lg bg-white dark:bg-slate-800">
                      <Icon
                        name={option.icon}
                        className="size-4 text-primary"
                        strokeWidth={2}
                        aria-hidden
                      />
                    </span>
                    <span className="preset-body_14/20 font-semibold text-neutral-900 dark:text-slate-100">
                      {option.label}
                    </span>
                    <span className="preset-body_12/16 text-neutral-500 dark:text-slate-400">
                      {option.description}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="preset-body_14/20 mb-3 font-medium text-neutral-800 dark:text-slate-200">
                Cor de destaque
              </legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {accentOptions.map((option) => (
                  <label
                    key={option.id}
                    className={clsx(
                      "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 transition-colors",
                      settings.accent === option.id
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-neutral-200 hover:border-neutral-300 dark:border-slate-600",
                    )}
                  >
                    <input
                      type="radio"
                      name={`${baseId}-accent`}
                      value={option.id}
                      checked={settings.accent === option.id}
                      onChange={() =>
                        setSettings((prev) => ({ ...prev, accent: option.id }))
                      }
                      className="sr-only"
                    />
                    <span
                      className="size-5 shrink-0 rounded-full"
                      style={{ backgroundColor: option.primary }}
                      aria-hidden
                    />
                    <span className="preset-body_14/20 font-medium text-neutral-800 dark:text-slate-200">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-neutral-200 bg-white px-6 pb-5 pt-4 dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onClose}
              className="preset-button_16/24 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:w-auto"
            >
              Cancelar
            </button>
            <Button
              type="submit"
              title={isSubmitting ? "Salvando..." : "Salvar aparência"}
              icon="Check"
              color="bg-primary text-white hover:brightness-110 active:brightness-95"
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            />
          </footer>
        </form>
      </div>
    </div>
  );
}
