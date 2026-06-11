import clsx from "clsx";
import { ApiUserRole } from "../../constants/apiUserRole";
import { Text } from "../Text";

const roleMeta: Record<
  ApiUserRole,
  { label: string; description: string; badge: string }
> = {
  [ApiUserRole.ADMIN]: {
    label: "Administrador",
    description:
      "Gerencie o estoque, o planejamento de aulas e os acessos da equipe da cozinha escolar.",
    badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/45 dark:text-purple-300",
  },
  [ApiUserRole.ESTOQUISTA]: {
    label: "Estoquista",
    description:
      "Acompanhe validades, níveis de estoque e itens que precisam de reposição.",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/45 dark:text-blue-300",
  },
  [ApiUserRole.PROFESSOR]: {
    label: "Professor",
    description:
      "Organize suas aulas e verifique os ingredientes necessários para cada receita.",
    badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/45 dark:text-indigo-300",
  },
};

export interface DashboardWelcomeProps {
  userName: string;
  role: ApiUserRole;
  className?: string;
}

export function DashboardWelcome({
  userName,
  role,
  className,
}: DashboardWelcomeProps) {
  const meta = roleMeta[role];
  const firstName = userName.split(" ")[0] ?? userName;

  return (
    <section
      className={clsx(
        "rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Text preset="headline_20/25" fontWeight="bold" color="black">
            Olá, {firstName}
          </Text>
          <Text preset="body_16/24" color="#4d5868" className="mt-2 max-w-2xl">
            {meta.description}
          </Text>
        </div>
        <span
          className={clsx(
            "preset-tag_12/16 shrink-0 self-start rounded-full px-3 py-1.5 font-semibold",
            meta.badge,
          )}
        >
          {meta.label}
        </span>
      </div>
    </section>
  );
}
