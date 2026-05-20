import clsx from "clsx";

export type ClassSlotAccent = "red" | "blue" | "amber";

type AccentStyle = { bg: string; border: string };

export interface ClassSlotData {
  id: string;
  title: string;
  instructor: string;
  location: string;
  accent: ClassSlotAccent;
}

export interface ClassSlotCardProps {
  lesson: ClassSlotData;
  showNoIngredients?: boolean;
  className?: string;
  onClick?: () => void;
}

const accentStyles: Record<
  ClassSlotAccent,
  { bg: string; border: string }
> = {
  red: { bg: "bg-red-50", border: "border-l-red-500" },
  blue: { bg: "bg-blue-50", border: "border-l-blue-500" },
  amber: { bg: "bg-yellow-50", border: "border-l-yellow-400" },
};

const cardClass = (tone: AccentStyle, className?: string) =>
  clsx(
    "relative w-full rounded-md border-l-4 p-3 pr-24 text-left shadow-sm transition",
    tone.bg,
    tone.border,
    "hover:brightness-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
    className,
  );

export function ClassSlotCard({
  lesson,
  showNoIngredients = false,
  className,
  onClick,
}: ClassSlotCardProps) {
  const tone = accentStyles[lesson.accent];

  const noIngredientsBadge = showNoIngredients ? (
    <span className="preset-tag_12/16 absolute right-2 top-2 max-w-[5.5rem] text-right leading-tight text-neutral-500">
      sem ingredientes
    </span>
  ) : null;

  const content = (
    <>
      {noIngredientsBadge}
      <p className="preset-body_14/20 truncate font-bold text-neutral-800">
        {lesson.title}
      </p>
      <p className="preset-body_12/16 mt-1 truncate text-neutral-500">
        {lesson.instructor}
      </p>
      <p className="preset-body_12/16 truncate text-neutral-500">{lesson.location}</p>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cardClass(tone, className)}>
        {content}
      </button>
    );
  }

  return <article className={cardClass(tone, className)}>{content}</article>;
}
