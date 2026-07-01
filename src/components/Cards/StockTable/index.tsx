import clsx from "clsx";
import { Icon } from "../../Icon";

export type StockRowStatus = "OK" | "Baixo";
export type StockRowVariant = "default" | "expired" | "warning";
export type ExpirationTone = "green" | "red" | "amber";

export interface StockProductRow {
  id: string;
  name: string;
  unit: string;
  category: string;
  quantity: number;
  expirationDate: string;
  expirationLabel: string;
  expirationTone: ExpirationTone;
  status: StockRowStatus;
  rowVariant: StockRowVariant;
  clockTone?: "red" | "amber";
}

export interface StockTableProps {
  rows: StockProductRow[];
  onEdit?: (row: StockProductRow) => void;
  className?: string;
}

const rowBg: Record<StockRowVariant, string> = {
  default: "bg-white dark:bg-slate-900",
  expired: "bg-red-50 dark:bg-red-950/45",
  warning: "bg-amber-50 dark:bg-amber-950/45",
};

const statusBadge: Record<StockRowStatus, string> = {
  OK: "bg-green-100 text-green-800 dark:bg-green-900/45 dark:text-green-300",
  Baixo: "bg-amber-100 text-amber-800 dark:bg-amber-900/45 dark:text-amber-300",
};

const expirationText: Record<ExpirationTone, string> = {
  green: "text-green-700 dark:text-green-400",
  red: "text-red-600 dark:text-red-400",
  amber: "text-amber-600 dark:text-amber-400",
};

const clockColor: Record<"red" | "amber", string> = {
  red: "text-red-600 dark:text-red-400",
  amber: "text-amber-500 dark:text-amber-400",
};

export function StockTable({ rows, onEdit, className }: StockTableProps) {
  return (
    <section
      className={clsx(
        "overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-slate-700 dark:bg-slate-800/80">
            <tr>
              {[
                { label: "Nome do item", align: "left" },
                { label: "Categoria", align: "left" },
                { label: "Quantidade", align: "left" },
                { label: "Uni", align: "center" },
                { label: "Validade", align: "left" },
                { label: "Status", align: "left" },
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
                  colSpan={7}
                  className="preset-body_14/20 px-4 py-10 text-center text-neutral-500"
                >
                  Nenhum item encontrado.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className={clsx(
                    "border-b border-neutral-100 last:border-b-0",
                    rowBg[row.rowVariant],
                  )}
                >
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2">
                      {row.clockTone ? (
                        <Icon
                          name="Clock"
                          className={clsx("size-4 shrink-0", clockColor[row.clockTone])}
                          strokeWidth={2}
                          aria-hidden
                        />
                      ) : null}
                      <span className="preset-body_14/20 font-bold text-neutral-900">
                        {row.name}
                      </span>
                    </div>
                  </td>
                  <td className="preset-body_14/20 px-4 py-3 align-middle text-neutral-800">
                    {row.category}
                  </td>
                  <td className="preset-body_14/20 px-4 py-3 align-middle font-bold text-neutral-900">
                    {row.quantity}
                  </td>
                  <td className="preset-body_14/20 px-4 py-3 text-center align-middle text-neutral-700">
                    {row.unit}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <p className="preset-body_14/20 font-bold text-neutral-900">
                      {row.expirationDate}
                    </p>
                    <p
                      className={clsx(
                        "preset-body_12/16 font-medium",
                        expirationText[row.expirationTone],
                      )}
                    >
                      {row.expirationLabel}
                    </p>
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
                  <td className="px-4 py-3 align-middle">
                    <button
                      type="button"
                      onClick={() => onEdit?.(row)}
                      className="preset-body_14/20 inline-flex items-center gap-1.5 font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Icon name="SquarePen" className="size-4" strokeWidth={2} aria-hidden />
                      Editar
                    </button>
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
