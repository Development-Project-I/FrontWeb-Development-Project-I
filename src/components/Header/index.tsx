import { Bell, User } from "lucide-react";

export function Header() {
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

        <div className="flex items-center gap-3">
          <div
            className="flex size-10 items-center justify-center rounded-full bg-primary text-white"
            aria-hidden
          >
            <User className="size-5" strokeWidth={2} />
          </div>
          <span className="text-sm font-bold text-neutral-900">Admin</span>
        </div>
      </div>
    </header>
  );
}
