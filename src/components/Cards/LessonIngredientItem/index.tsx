import clsx from "clsx";
import { Icon } from "../../Icon";

export type IngredientStockStatus = "OK" | "Esgotado";

export interface LessonIngredient {
  id: string;
  name: string;
  required: number;
  available: number;
  status: IngredientStockStatus;
}

export interface LessonIngredientItemProps {
  ingredient: LessonIngredient;
  className?: string;
}

const statusBadge: Record<IngredientStockStatus, string> = {
  OK: "bg-green-100 text-green-800",
  Esgotado: "bg-red-100 text-red-700",
};

export function LessonIngredientItem({
  ingredient,
  className,
}: LessonIngredientItemProps) {
  const isOut = ingredient.status === "Esgotado";

  return (
    <article
      className={clsx(
        "flex items-center gap-4 rounded-lg border border-neutral-200 bg-white px-4 py-3",
        className,
      )}
    >
      <Icon
        name={isOut ? "XCircle" : "CheckCircle"}
        className={clsx("size-5 shrink-0", isOut ? "text-red-600" : "text-green-600")}
        strokeWidth={2}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="preset-body_14/20 font-bold text-neutral-900">{ingredient.name}</p>
        <p className="preset-body_12/16 text-neutral-500">
          Necessário: {ingredient.required} | Disponível: {ingredient.available}
        </p>
      </div>
      <span
        className={clsx(
          "preset-tag_12/16 shrink-0 rounded-md px-2.5 py-1 font-semibold",
          statusBadge[ingredient.status],
        )}
      >
        {ingredient.status}
      </span>
    </article>
  );
}
