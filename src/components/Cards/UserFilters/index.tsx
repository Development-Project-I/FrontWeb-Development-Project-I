import clsx from "clsx";
import { USER_ROLES } from "../../../constants/users";
import { Icon } from "../../Icon";

export interface UserFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  role: string;
  onRoleChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  className?: string;
}

const selectClass =
  "w-full appearance-none rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none ring-primary/30 focus:border-primary focus:ring-2";

export function UserFilters({
  search,
  onSearchChange,
  role,
  onRoleChange,
  sortBy,
  onSortByChange,
  className,
}: UserFiltersProps) {
  return (
    <section
      className={clsx(
        "rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      <div className="relative">
        <Icon
          name="Search"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
          strokeWidth={2}
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-3 text-sm text-neutral-900 outline-none ring-primary/30 placeholder:text-neutral-400 focus:border-primary focus:ring-2"
          aria-label="Buscar usuário por nome ou e-mail"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className={selectClass}
          aria-label="Filtrar por tipo"
        >
          <option value="all">Todos os Tipos</option>
          {USER_ROLES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className={selectClass}
          aria-label="Ordenar usuários"
        >
          <option value="name">Ordenar por Nome</option>
          <option value="email">Ordenar por E-mail</option>
          <option value="role">Ordenar por Tipo</option>
          <option value="lastAccess">Ordenar por Último acesso</option>
        </select>
      </div>
    </section>
  );
}
