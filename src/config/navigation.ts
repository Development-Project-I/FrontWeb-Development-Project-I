import {
  BookOpen,
  FileText,
  LayoutGrid,
  Package,
  Settings,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ApiUserRole } from "../constants/apiUserRole";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  roles: readonly ApiUserRole[];
}

export const NAV_ITEMS: NavItem[] = [
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
