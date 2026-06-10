import clsx from "clsx";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
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
  placement?: "top" | "bottom";
  anchorRef?: RefObject<HTMLElement | null>;
}

interface PanelPosition {
  top: number;
  left: number;
}

function getPanelPosition(
  anchor: HTMLElement,
  placement: "top" | "bottom",
): PanelPosition {
  const rect = anchor.getBoundingClientRect();
  const gap = 8;

  if (placement === "top") {
    return {
      top: rect.top - gap,
      left: rect.right,
    };
  }

  return {
    top: rect.bottom + gap,
    left: rect.right,
  };
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
  placement = "bottom",
  anchorRef,
}: ConfirmDropdownProps) {
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<PanelPosition>({ top: 0, left: 0 });
  const usePortal = Boolean(anchorRef);

  useLayoutEffect(() => {
    if (!isOpen || !anchorRef?.current) return;

    const updatePosition = () => {
      if (!anchorRef.current) return;
      setPosition(getPanelPosition(anchorRef.current, placement));
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, anchorRef, placement]);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (anchorRef?.current?.contains(target)) return;
      onClose();
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
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  const panel = (
    <div
      ref={containerRef}
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${panelId}-message`}
      style={
        usePortal
          ? {
              position: "fixed",
              top: position.top,
              left: position.left,
              transform:
                placement === "top"
                  ? "translate(-100%, -100%)"
                  : "translateX(-100%)",
            }
          : undefined
      }
      className={clsx(
        "z-[9999] w-[min(100vw-2rem,300px)] rounded-xl border border-neutral-200 bg-white p-4 shadow-xl animate-in fade-in zoom-in-95 duration-150",
        !usePortal && "absolute right-0",
        !usePortal &&
          (placement === "top"
            ? "bottom-full mb-2 origin-bottom-right"
            : "top-full mt-2 origin-top-right"),
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

  if (usePortal) {
    return createPortal(panel, document.body);
  }

  return panel;
}
