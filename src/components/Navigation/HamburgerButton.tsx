import clsx from "clsx";
import { Menu, X } from "lucide-react";

export interface HamburgerButtonProps {
  isOpen?: boolean;
  onClick: () => void;
  className?: string;
}

export function HamburgerButton({
  isOpen = false,
  onClick,
  className,
}: HamburgerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
        className,
      )}
      aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-nav-drawer"
    >
      {isOpen ? (
        <X className="size-6" strokeWidth={2} aria-hidden />
      ) : (
        <Menu className="size-6" strokeWidth={2} aria-hidden />
      )}
    </button>
  );
}
