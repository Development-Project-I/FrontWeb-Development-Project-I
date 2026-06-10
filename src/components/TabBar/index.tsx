import { NavLink } from "react-router-dom";
import clsx from "clsx";
import {
  BookOpen,
  FileText,
  LayoutGrid,
  Package,
  Settings,
  Users,
  Shield,
} from "lucide-react";
import { ApiUserRole } from "../../constants/apiUserRole";
import { canAccessNavItem } from "../../config/permissions";
import { useAuth } from "../../contexts/AuthContext";

const navItems: {
  to: string;
  label: string;
  icon: typeof LayoutGrid;
  roles: readonly ApiUserRole[];
}[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutGrid,
    roles: [ApiUserRole.ADMIN, ApiUserRole.PROFESSOR, ApiUserRole.ESTOQUISTA],
  },
  {
    to: "/estoque",
    label: "Estoque",
    icon: Package,
    roles: [ApiUserRole.ADMIN, ApiUserRole.ESTOQUISTA],
  },
  {
    to: "/planejamento-aulas",
    label: "Planejamento de Aulas",
    icon: BookOpen,
    roles: [ApiUserRole.ADMIN, ApiUserRole.PROFESSOR],
  },
  {
    to: "/professores",
    label: "Professores",
    icon: Users,
    roles: [ApiUserRole.ADMIN],
  },
  {
    to: "/usuarios",
    label: "Usuários do Sistema",
    icon: Shield,
    roles: [ApiUserRole.ADMIN],
  },
  {
    to: "/relatorios",
    label: "Relatórios",
    icon: FileText,
    roles: [ApiUserRole.ADMIN, ApiUserRole.PROFESSOR, ApiUserRole.ESTOQUISTA],
  },
  {
    to: "/configuracoes",
    label: "Configurações",
    icon: Settings,
    roles: [ApiUserRole.ADMIN, ApiUserRole.PROFESSOR, ApiUserRole.ESTOQUISTA],
  },
];

export function TabBar() {
  const { user } = useAuth();
  const visibleItems = navItems.filter((item) =>
    user ? canAccessNavItem(user.role, item.roles) : false,
  );

  return (
    <aside className="sticky top-0 z-30 flex h-screen w-[260px] shrink-0 flex-col overflow-y-auto border-r border-neutral-200 bg-white px-4 py-8">
      <div className="px-2">
        <span className="text-xl font-bold tracking-tight text-neutral-900">
          GastroPlan
        </span>
      </div>

      <nav className="mt-10 flex flex-col gap-1" aria-label="Principal">
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary text-primary"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700",
              )
            }
          >
            <Icon className="size-5 shrink-0" strokeWidth={2} aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
