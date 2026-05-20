import clsx from "clsx";
import type { LessonIngredientDetail } from "../../../data/lessons";
import { Icon } from "../../Icon";

export interface LessonIngredientDetailCardProps {
  ingredient: LessonIngredientDetail;
  onRemove?: (ingredientId: string) => void;
  className?: string;
}

const badgeStyles = {
  OK: "bg-green-100 text-green-800",
  Baixo: "bg-amber-100 text-amber-800",
  SemEstoque: "bg-red-100 text-red-700",
} as const;

const badgeLabels = {
  OK: "OK",
  Baixo: "Baixo",
  SemEstoque: "Sem estoque",
} as const;

const disponivelStyles = {
  OK: "text-green-700",
  Baixo: "text-amber-600",
  SemEstoque: "text-red-600",
} as const;

const borderStyles = {
  OK: "border-neutral-200",
  Baixo: "border-amber-300",
  SemEstoque: "border-red-300",
} as const;

const alertStyles = {
  Baixo: "border-amber-200 bg-amber-50/80 text-amber-800",
  SemEstoque: "border-red-200 bg-red-50/80 text-red-700",
} as const;

export function LessonIngredientDetailCard({
  ingredient,
  onRemove,
  className,
}: LessonIngredientDetailCardProps) {
  const { status } = ingredient;
  const unitsMatch = ingredient.requiredUnit === ingredient.stockUnit;
  const missing = unitsMatch
    ? Math.max(0, ingredient.required - ingredient.available)
    : 0;

  const iconName =
    status === "OK"
      ? "CheckCircle"
      : status === "SemEstoque"
        ? "XCircle"
        : "AlertTriangle";

  const iconClass =
    status === "OK"
      ? "text-green-600"
      : status === "SemEstoque"
        ? "text-red-600"
        : "text-amber-500";

  const alertMessage =
    status === "SemEstoque"
      ? "Produto indisponível no estoque."
      : unitsMatch && missing > 0
        ? `Estoque insuficiente! Faltam ${missing} ${ingredient.requiredUnit}.`
        : `Estoque insuficiente para esta aula (${ingredient.available} ${ingredient.stockUnit} disponíveis).`;

  return (
    <article
      className={clsx(
        "overflow-hidden rounded-xl border bg-white shadow-sm",
        borderStyles[status],
        className,
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <Icon
          name={iconName}
          className={clsx("mt-0.5 size-5 shrink-0", iconClass)}
          strokeWidth={2}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="preset-body_16/24 font-bold text-neutral-900">
                {ingredient.name}
              </p>
              <p className="preset-body_14/20 text-neutral-500">{ingredient.category}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <span
                className={clsx(
                  "preset-tag_12/16 rounded-md px-2.5 py-1 font-semibold",
                  badgeStyles[status],
                )}
              >
                {badgeLabels[status]}
              </span>
              {onRemove ? (
                <button
                  type="button"
                  onClick={() => onRemove(ingredient.id)}
                  className="rounded-md p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label={`Remover ${ingredient.name} da aula`}
                >
                  <Icon name="Trash2" className="size-4" strokeWidth={2} aria-hidden />
                </button>
              ) : null}
            </div>
          </div>
          <div className="preset-body_14/20 mt-3 flex flex-wrap gap-x-6 gap-y-1 text-neutral-600">
            <span>
              Necessário:{" "}
              <strong className="text-neutral-900">
                {ingredient.required} {ingredient.requiredUnit}
              </strong>
            </span>
            <span>
              Disponível:{" "}
              <strong className={clsx(disponivelStyles[status])}>
                {ingredient.available} {ingredient.stockUnit}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {status !== "OK" ? (
        <div className={clsx("border-t px-4 py-3", alertStyles[status])}>
          <p className="preset-body_14/20 font-medium">
            <span aria-hidden>⚠️ </span>
            {alertMessage}
          </p>
        </div>
      ) : null}
    </article>
  );
}
