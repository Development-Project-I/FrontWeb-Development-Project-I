import clsx from "clsx";
import { Icon } from "../../Icon";

export type ReportStatus = "Disponível";

export interface ReportRow {
  id: string;
  title: string;
  type: string;
  date: string;
  status: ReportStatus;
}

export interface ReportsTableProps {
  rows?: ReportRow[];
  className?: string;
}

const defaultRows: ReportRow[] = [
  {
    id: "1",
    title: "Relatório de Estoque - Abril 2026",
    type: "Estoque",
    date: "09/04/2026",
    status: "Disponível",
  },
  {
    id: "2",
    title: "Relatório de Aulas - Março 2026",
    type: "Aulas",
    date: "05/04/2026",
    status: "Disponível",
  },
  {
    id: "3",
    title: "Relatório de Materiais - Março 2026",
    type: "Materiais",
    date: "02/04/2026",
    status: "Disponível",
  },
  {
    id: "4",
    title: "Relatório de Professores - 1º Trimestre",
    type: "Professores",
    date: "28/03/2026",
    status: "Disponível",
  },
];

const statusBadge: Record<ReportStatus, string> = {
  Disponível: "bg-green-100 text-green-800",
};

export function ReportsTable({ rows = defaultRows, className }: ReportsTableProps) {
  return (
    <section
      className={clsx(
        "overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm",
        className,
      )}
    >
      <div className="border-b border-neutral-100 px-6 py-5">
        <h2 className="preset-headline_18/24 font-bold text-neutral-900">
          Relatórios Disponíveis
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead className="border-b border-neutral-200 bg-white">
            <tr>
              {["Título", "Tipo", "Data", "Status", "Ações"].map((col) => (
                <th
                  key={col}
                  scope="col"
                  className={clsx(
                    "preset-body_12/16 px-6 py-3 font-semibold uppercase tracking-wide text-neutral-500",
                    col === "Ações" && "text-center",
                  )}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-neutral-100 last:border-b-0"
              >
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center gap-2">
                    <Icon
                      name="FileText"
                      className="size-4 shrink-0 text-neutral-400"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span className="preset-body_14/20 font-medium text-neutral-900">
                      {row.title}
                    </span>
                  </div>
                </td>
                <td className="preset-body_14/20 px-6 py-4 align-middle text-neutral-700">
                  {row.type}
                </td>
                <td className="preset-body_14/20 px-6 py-4 align-middle text-neutral-700">
                  {row.date}
                </td>
                <td className="px-6 py-4 align-middle">
                  <span
                    className={clsx(
                      "preset-tag_12/16 inline-block rounded-full px-2.5 py-1 font-semibold",
                      statusBadge[row.status],
                    )}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="flex justify-center">
                    <button
                      type="button"
                      className="preset-body_14/20 inline-flex items-center gap-1.5 font-semibold text-blue-600 transition-colors hover:text-blue-700"
                    >
                      <Icon
                        name="Download"
                        className="size-4"
                        strokeWidth={2}
                        aria-hidden
                      />
                      Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
