import clsx from "clsx";
import { useEffect, useId, useRef } from "react";
import { Icon } from "../Icon";

export interface ConfirmDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  className?: string;
}

export function ConfirmDropdown({
  isOpen,
  onClose,
  onConfirm,
  message = "Deseja mesmo cancelar aula?",
  confirmLabel = "Sim",
  cancelLabel = "Não",
  isLoading = false,
  className,
}: ConfirmDropdownProps) {
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${panelId}-message`}
      className={clsx(
        "absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,300px)] origin-top-right rounded-xl border border-neutral-200 bg-white p-4 shadow-xl animate-in fade-in zoom-in-95 duration-150",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-50">
          <Icon
            name="AlertTriangle"
            className="size-4 text-red-600"
            strokeWidth={2}
            aria-hidden
          />
        </div>
        <p
          id={`${panelId}-message`}
          className="preset-body_14/20 pt-1.5 font-medium text-neutral-800"
        >
          {message}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="preset-button_16/24 rounded-lg border border-neutral-200 bg-white px-4 py-2 font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className="preset-button_16/24 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {isLoading ? "Aguarde..." : confirmLabel}
        </button>
      </div>
    </div>
  );
}
