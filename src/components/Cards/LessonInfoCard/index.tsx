import clsx from "clsx";
import { Icon } from "../../Icon";

export interface LessonInfoCardProps {
  icon: string;
  label: string;
  value: string;
  className?: string;
}

export function LessonInfoCard({
  icon,
  label,
  value,
  className,
}: LessonInfoCardProps) {
  return (
    <article
      className={clsx(
        "rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-800/60",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-neutral-500 dark:text-slate-400">
        <Icon name={icon} className="size-4 shrink-0" strokeWidth={2} aria-hidden />
        <span className="preset-body_12/16 font-medium">{label}</span>
      </div>
      <p className="preset-body_16/24 mt-2 font-bold text-neutral-900">{value}</p>
    </article>
  );
}
