import clsx from "clsx";
import { Icon } from "../../Icon";

const accents = {
  blue: {
    box: "bg-blue-50 dark:bg-blue-950/50",
    icon: "text-blue-600 dark:text-blue-400",
  },
  amber: {
    box: "bg-amber-50 dark:bg-amber-950/50",
    icon: "text-amber-600 dark:text-amber-400",
  },
  red: {
    box: "bg-red-50 dark:bg-red-950/50",
    icon: "text-red-600 dark:text-red-400",
  },
  green: {
    box: "bg-green-50 dark:bg-green-950/50",
    icon: "text-green-600 dark:text-green-400",
  },
  purple: {
    box: "bg-purple-50 dark:bg-purple-950/50",
    icon: "text-purple-600 dark:text-purple-400",
  },
  neutral: {
    box: "bg-neutral-100 dark:bg-slate-800",
    icon: "text-neutral-600 dark:text-slate-400",
  },
} as const;

export type SettingsCardAccent = keyof typeof accents;

export interface SettingsCardProps {
  icon: string;
  title: string;
  description: string;
  accent?: SettingsCardAccent;
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
}

export function SettingsCard({
  icon,
  title,
  description,
  accent = "blue",
  className,
  onClick,
  isLoading = false,
}: SettingsCardProps) {
  const tone = accents[accent];
  const Component = onClick ? "button" : "article";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      disabled={isLoading}
      aria-busy={isLoading}
      className={clsx(
        "flex w-full flex-col rounded-xl border border-neutral-200 bg-white p-6 text-left shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900",
        onClick &&
          "cursor-pointer hover:border-neutral-300 hover:bg-neutral-50/50 dark:hover:border-slate-600 dark:hover:bg-slate-800/80",
        isLoading && "pointer-events-none opacity-70",
        className,
      )}
    >
      <div
        className={clsx(
          "flex size-11 items-center justify-center rounded-lg",
          tone.box,
        )}
      >
        <Icon
          name={icon}
          color={tone.icon}
          className="size-5 shrink-0"
          strokeWidth={2}
          aria-hidden
        />
      </div>
      <h3 className="preset-body_16/24 mt-4 font-bold text-neutral-900">
        {isLoading ? "Carregando..." : title}
      </h3>
      <p className="preset-body_14/20 mt-1 text-neutral-500">{description}</p>
    </Component>
  );
}
