import clsx from "clsx";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function Header() {
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
    <header className="sticky top-0 z-20 flex h-[72px] shrink-0 items-center justify-end gap-6 border-b border-neutral-200 bg-white px-8">
      <div className="flex items-center gap-6">
        <button
          type="button"
          className="relative rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          aria-label="Notificações"
        >
          <Bell className="size-6" strokeWidth={2} aria-hidden />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-controls={menuId}
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-neutral-100"
          >
            <div
              className="flex size-10 items-center justify-center rounded-full bg-primary text-white"
              aria-hidden
            >
              <User className="size-5" strokeWidth={2} />
            </div>
            <span className="text-sm font-bold text-neutral-900">
              {user?.name ?? "Usuário"}
            </span>
            <ChevronDown
              className={clsx(
                "size-4 text-neutral-500 transition-transform",
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
              className="absolute right-0 top-full z-50 mt-2 min-w-[180px] origin-top-right rounded-xl border border-neutral-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="preset-button_16/24 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 font-semibold text-red-600 transition hover:bg-red-50"
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
