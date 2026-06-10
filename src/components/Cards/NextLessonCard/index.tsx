import clsx from "clsx";
import { useEffect, useState } from "react";
import { Icon } from "../../Icon";
import type { ClassSlotAccent } from "../WeeklyCalendar/ClassSlotCard";
import {
  LessonIngredientItem,
  type LessonIngredient,
} from "../LessonIngredientItem";

export interface NextLessonData {
  title: string;
  timeRange: string;
  location: string;
  instructor: string;
}

export interface NextLessonCardProps {
  lesson?: NextLessonData;
  ingredients?: LessonIngredient[];
  stockAccent?: ClassSlotAccent;
  isLoading?: boolean;
  className?: string;
}

const cardAccentStyles: Record<
  ClassSlotAccent,
  { bg: string; border: string; divider: string }
> = {
  red: {
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-100 dark:border-red-900/50",
    divider: "border-red-100 dark:border-red-900/50",
  },
  amber: {
    bg: "bg-yellow-50 dark:bg-amber-950/40",
    border: "border-yellow-200 dark:border-amber-900/50",
    divider: "border-yellow-200 dark:border-amber-900/50",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-slate-800/80",
    border: "border-blue-100 dark:border-slate-600",
    divider: "border-blue-100 dark:border-slate-600",
  },
};

function NextLessonCardSkeleton({ className }: { className?: string }) {
  const tone = cardAccentStyles.blue;

  return (
    <section
      className={clsx(
        "overflow-hidden rounded-2xl border p-6 shadow-sm",
        tone.bg,
        tone.border,
        className,
      )}
      role="status"
      aria-label="Carregando próxima aula"
    >
      <div className="select-none blur-md">
        <div className="flex items-start justify-between gap-4">
          <div className="h-7 min-w-0 flex-1 rounded-lg bg-neutral-300/70" />
          <div className="h-7 w-28 shrink-0 rounded-full bg-blue-200/80" />
        </div>
        <div className="mt-4 h-5 w-36 rounded-md bg-neutral-300/60" />
      </div>
    </section>
  );
}

export function NextLessonCard({
  lesson,
  ingredients = [],
  stockAccent = "blue",
  isLoading = false,
  className,
}: NextLessonCardProps) {
  const [expanded, setExpanded] = useState(false);
  const tone = cardAccentStyles[stockAccent];

  useEffect(() => {
    if (isLoading) setExpanded(false);
  }, [isLoading]);

  useEffect(() => {
    setExpanded(false);
  }, [lesson?.title]);

  if (isLoading) {
    return <NextLessonCardSkeleton className={className} />;
  }

  if (!lesson) return null;

  return (
    <section
      className={clsx(
        "rounded-2xl border p-6 shadow-sm",
        tone.bg,
        tone.border,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="preset-headline_20/25 min-w-0 flex-1 font-bold text-neutral-900">
          {lesson.title}
        </h2>
        <span className="preset-tag_12/16 shrink-0 rounded-full bg-blue-100 px-3 py-1.5 font-semibold text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
          Próxima Aula
        </span>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className="preset-body_14/20 mt-4 inline-flex items-center gap-1.5 font-medium text-primary transition-colors hover:text-primary/80"
        aria-expanded={expanded}
        aria-controls="next-lesson-details"
      >
        <Icon
          name="ChevronDown"
          className={clsx(
            "size-4 shrink-0 transition-transform duration-300",
            expanded && "rotate-180",
          )}
          strokeWidth={2}
          aria-hidden
        />
        {expanded ? "Ver menos detalhes" : "Ver mais detalhes"}
      </button>

      <div
        id="next-lesson-details"
        className={clsx(
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div
            className={clsx(
              "border-t pt-6 transition-opacity duration-300",
              tone.divider,
              expanded ? "mt-6 opacity-100" : "opacity-0",
            )}
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="preset-body_14/20 inline-flex items-center gap-2 text-neutral-700">
                <Icon
                  name="Clock"
                  className="size-4 shrink-0 text-neutral-500"
                  strokeWidth={2}
                  aria-hidden
                />
                {lesson.timeRange}
              </span>
              <span className="preset-body_14/20 inline-flex items-center gap-2 text-neutral-700">
                <Icon
                  name="MapPin"
                  className="size-4 shrink-0 text-neutral-500"
                  strokeWidth={2}
                  aria-hidden
                />
                {lesson.location}
              </span>
            </div>
            <p className="preset-body_14/20 mt-2 text-neutral-700">
              {lesson.instructor}
            </p>

            <div className="mt-6">
              <div className="flex items-center gap-2">
                <Icon
                  name="Package"
                  className="size-5 shrink-0 text-neutral-600"
                  strokeWidth={2}
                  aria-hidden
                />
                <h3 className="preset-body_16/24 font-semibold text-neutral-900">
                  Ingredientes Necessários
                </h3>
              </div>
              {ingredients.length === 0 ? (
                <p className="preset-body_14/20 mt-4 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-neutral-600 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-400">
                  Nenhum ingrediente adicionado a esta aula.
                </p>
              ) : (
                <ul className="mt-4 flex flex-col gap-3">
                  {ingredients.map((item) => (
                    <li key={item.id}>
                      <LessonIngredientItem ingredient={item} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
