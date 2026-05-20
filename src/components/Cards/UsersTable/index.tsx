import clsx from "clsx";
import type { UserRole, UserStatus } from "../../../constants/users";
import { Icon } from "../../Icon";

export interface UserListRow {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastAccess: string;
}

export interface UsersTableProps {
  rows: UserListRow[];
  className?: string;
}

const roleBadge: Record<UserRole, string> = {
  Estoquista: "bg-blue-100 text-blue-800",
  Professor: "bg-purple-100 text-purple-800",
  Administrador: "bg-pink-100 text-pink-900",
};

const statusBadge: Record<UserStatus, string> = {
  Ativo: "bg-green-100 text-green-800",
  Inativo: "bg-neutral-100 text-neutral-600",
};

export function UsersTable({ rows, className }: UsersTableProps) {
  return (
    <section
      className={clsx(
        "overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              {[
                { label: "Nome", align: "left" },
                { label: "E-mail", align: "left" },
                { label: "Tipo", align: "left" },
                { label: "Status", align: "left" },
                { label: "Último acesso", align: "left" },
                { label: "Ações", align: "center" },
              ].map((col) => (
                <th
                  key={col.label}
                  scope="col"
                  className={clsx(
                    "preset-body_12/16 px-4 py-3 font-semibold uppercase tracking-wide text-neutral-500",
                    col.align === "center" && "text-center",
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="preset-body_14/20 px-4 py-10 text-center text-neutral-500"
                >
                  Nenhum usuário encontrado.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-neutral-100 bg-white last:border-b-0"
                >
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-600">
                        <Icon
                          name="User"
                          className="size-4"
                          strokeWidth={2}
                          aria-hidden
                        />
                      </span>
                      <span className="preset-body_14/20 font-bold text-neutral-900">
                        {row.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2 text-neutral-700">
                      <Icon
                        name="Mail"
                        className="size-4 shrink-0 text-neutral-400"
                        strokeWidth={2}
                        aria-hidden
                      />
                      <span className="preset-body_14/20">{row.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <span
                      className={clsx(
                        "preset-tag_12/16 inline-block rounded-md px-2.5 py-1 font-semibold",
                        roleBadge[row.role],
                      )}
                    >
                      {row.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <span
                      className={clsx(
                        "preset-tag_12/16 inline-block rounded-md px-2.5 py-1 font-semibold",
                        statusBadge[row.status],
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="preset-body_14/20 px-4 py-3 align-middle text-neutral-700">
                    {row.lastAccess}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        className="preset-body_14/20 inline-flex items-center gap-1.5 font-semibold text-blue-600 transition-colors hover:text-blue-700"
                        aria-label={`Editar ${row.name}`}
                      >
                        <Icon name="SquarePen" className="size-4" strokeWidth={2} aria-hidden />
                        Editar
                      </button>
                      <button
                        type="button"
                        className="rounded-md p-2 text-red-600 transition-colors hover:bg-red-50"
                        aria-label={`Excluir ${row.name}`}
                      >
                        <Icon name="Trash2" className="size-4" strokeWidth={2} aria-hidden />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
