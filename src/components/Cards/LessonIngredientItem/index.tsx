import clsx from "clsx";
import { Icon } from "../../Icon";

export type IngredientStockStatus = "OK" | "Baixo" | "Esgotado";

export interface LessonIngredient {
  id: string;
  name: string;
  required: number;
  available: number;
  status: IngredientStockStatus;
}

export interface LessonIngredientItemProps {
  ingredient: LessonIngredient;
  isLoading?: boolean;
  className?: string;
}

const statusBadge: Record<IngredientStockStatus, string> = {
  OK: "bg-green-100 text-green-800 dark:bg-green-900/45 dark:text-green-300",
  Baixo: "bg-amber-100 text-amber-800 dark:bg-amber-900/45 dark:text-amber-300",
  Esgotado: "bg-red-100 text-red-700 dark:bg-red-900/45 dark:text-red-300",
};

export function LessonIngredientItem({
  ingredient,
  isLoading = false,
  className,
}: LessonIngredientItemProps) {
  const isOut = ingredient.status === "Esgotado";
  const isLow = ingredient.status === "Baixo";

  return (
    <article
      className={clsx(
        "flex items-center gap-4 rounded-lg border border-neutral-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900/80",
        className,
      )}
    >
      <Icon
        name={
          isLoading
            ? "Circle"
            : isOut
              ? "XCircle"
              : isLow
                ? "AlertTriangle"
                : "CheckCircle"
        }
        className={clsx(
          "size-5 shrink-0",
          isLoading
            ? "text-neutral-300"
            : isOut
              ? "text-red-600"
              : isLow
                ? "text-amber-600"
                : "text-green-600",
        )}
        strokeWidth={2}
        aria-hidden
      />
      <div
        className={clsx(
          "min-w-0 flex-1 transition-[filter]",
          isLoading && "select-none blur-md",
        )}
        aria-busy={isLoading}
      >
        <p className="preset-body_14/20 font-bold text-neutral-900">
          {isLoading ? "Ingrediente" : ingredient.name}
        </p>
        <p className="preset-body_12/16 text-neutral-500">
          Necessário: {ingredient.required} | Disponível: {ingredient.available}
        </p>
      </div>
      <span
        className={clsx(
          "preset-tag_12/16 shrink-0 rounded-md px-2.5 py-1 font-semibold transition-[filter]",
          isLoading ? "bg-neutral-100 text-neutral-400" : statusBadge[ingredient.status],
          isLoading && "select-none blur-md",
        )}
      >
        {isLoading ? "—" : ingredient.status}
      </span>
    </article>
  );
}
