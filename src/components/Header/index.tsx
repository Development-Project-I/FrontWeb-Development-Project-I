import clsx from "clsx";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { HamburgerButton } from "../Navigation/HamburgerButton";

export interface HeaderProps {
  mobileNavOpen?: boolean;
  onMenuToggle?: () => void;
}

export function Header({ mobileNavOpen = false, onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-neutral-200 bg-white px-4 sm:h-[72px] sm:px-6 lg:px-8 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex min-w-0 items-center gap-3">
        {onMenuToggle ? (
          <HamburgerButton
            isOpen={mobileNavOpen}
            onClick={onMenuToggle}
            className="lg:hidden"
          />
        ) : null}
        <span className="truncate text-lg font-bold tracking-tight text-neutral-900 lg:hidden dark:text-slate-100">
          GastroPlan
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-6">
        <button
          type="button"
          className="relative rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          aria-label="Notificações"
        >
          <Bell className="size-5 sm:size-6" strokeWidth={2} aria-hidden />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-controls={menuId}
            className="flex items-center gap-2 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-neutral-100 sm:gap-3 sm:px-2 dark:hover:bg-slate-800"
          >
            <div
              className="flex size-9 items-center justify-center rounded-full bg-primary text-white sm:size-10"
              aria-hidden
            >
              <User className="size-4 sm:size-5" strokeWidth={2} />
            </div>
            <span className="hidden text-sm font-bold text-neutral-900 sm:inline dark:text-slate-100">
              {user?.name ?? "Usuário"}
            </span>
            <ChevronDown
              className={clsx(
                "size-4 text-neutral-500 transition-transform dark:text-slate-400",
                menuOpen && "rotate-180",
              )}
              strokeWidth={2}
              aria-hidden
            />
          </button>

          {menuOpen ? (
            <div
              id={menuId}
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 min-w-[180px] origin-top-right rounded-xl border border-neutral-200 bg-white p-2 shadow-xl duration-150 animate-in fade-in zoom-in-95 dark:border-slate-700 dark:bg-slate-900"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="preset-button_16/24 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 font-semibold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/50"
              >
                <LogOut className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                Sair
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
