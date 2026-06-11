import clsx from "clsx";
import { useEffect } from "react";
import { SideNavPanel } from "./SideNavPanel";

export interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={clsx(
        "fixed inset-0 z-40 lg:hidden",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className={clsx(
          "absolute inset-0 bg-neutral-950/60 backdrop-blur-[1px] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        aria-label="Fechar menu"
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
      />

      <aside
        id="mobile-nav-drawer"
        className={clsx(
          "absolute inset-y-0 left-0 z-50 flex w-[min(280px,85vw)] flex-col overflow-y-auto border-r border-neutral-200 bg-white px-4 py-8 shadow-xl transition-transform duration-300 ease-out dark:border-slate-700 dark:bg-slate-900",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <SideNavPanel onNavigate={onClose} />
      </aside>
    </div>
  );
}
