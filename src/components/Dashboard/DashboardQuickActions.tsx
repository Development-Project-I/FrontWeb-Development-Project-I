import { useNavigate } from "react-router-dom";
import {
  SettingsCard,
  type SettingsCardAccent,
} from "../Cards/SettingsCard";
import { ApiUserRole } from "../../constants/apiUserRole";
import { OPEN_MODAL, type OpenModalKey } from "../../constants/navigationState";
import { Text } from "../Text";

interface QuickAction {
  id: string;
  to: string;
  openModal: OpenModalKey;
  icon: string;
  title: string;
  description: string;
  accent: SettingsCardAccent;
  roles: readonly ApiUserRole[];
}

const quickActions: QuickAction[] = [
  {
    id: "create-user",
    to: "/usuarios",
    openModal: OPEN_MODAL.CREATE_USER,
    icon: "UserPlus",
    title: "Adicionar Usuário",
    description: "Cadastre um novo perfil de acesso para a equipe.",
    accent: "purple",
    roles: [ApiUserRole.ADMIN],
  },
  {
    id: "add-stock",
    to: "/estoque",
    openModal: OPEN_MODAL.ADD_STOCK_ITEM,
    icon: "PackagePlus",
    title: "Adicionar Item no estoque",
    description: "Inclua um novo ingrediente com validade e quantidade.",
    accent: "blue",
    roles: [ApiUserRole.ADMIN, ApiUserRole.ESTOQUISTA],
  },
  {
    id: "create-lesson",
    to: "/planejamento-aulas",
    openModal: OPEN_MODAL.CREATE_LESSON,
    icon: "BookPlus",
    title: "Criar Aula",
    description: "Agende uma nova aula no calendário semanal.",
    accent: "green",
    roles: [ApiUserRole.ADMIN, ApiUserRole.PROFESSOR],
  },
];

export interface DashboardQuickActionsProps {
  role: ApiUserRole;
}

export function DashboardQuickActions({ role }: DashboardQuickActionsProps) {
  const navigate = useNavigate();
  const items = quickActions.filter((item) => item.roles.includes(role));

  if (items.length === 0) return null;

  return (
    <section>
      <Text preset="headline_18/24" fontWeight="bold" color="black">
        Ações rápidas
      </Text>
      <Text preset="body_16/24" color="#4d5868" className="mt-2">
        Atalhos para as tarefas mais comuns do dia a dia.
      </Text>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <SettingsCard
              icon={item.icon}
              title={item.title}
              description={item.description}
              accent={item.accent}
              onClick={() =>
                navigate(item.to, { state: { openModal: item.openModal } })
              }
              className="h-full"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
