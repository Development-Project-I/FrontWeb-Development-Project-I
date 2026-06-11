import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { canAccessNavItem } from "../../config/permissions";
import { NAV_ITEMS } from "../../config/navigation";
import { useAuth } from "../../contexts/AuthContext";

export interface SideNavProps {
  onNavigate?: () => void;
  className?: string;
}

export function SideNav({ onNavigate, className }: SideNavProps) {
  const { user } = useAuth();
  const visibleItems = NAV_ITEMS.filter((item) =>
    user ? canAccessNavItem(user.role, item.roles) : false,
  );

  return (
    <nav
      className={clsx("flex flex-col gap-1", className)}
      aria-label="Principal"
    >
      {visibleItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/dashboard"}
          onClick={onNavigate}
          className={({ isActive }) =>
            clsx(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-secondary text-primary"
                : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200",
            )
          }
        >
          <Icon className="size-5 shrink-0" strokeWidth={2} aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
