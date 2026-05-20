import clsx from "clsx";
import { Icon } from "../../Icon";

const accents = {
  blue: {
    box: "bg-blue-50",
    icon: "text-blue-600",
  },
  amber: {
    box: "bg-amber-50",
    icon: "text-amber-600",
  },
  red: {
    box: "bg-red-50",
    icon: "text-red-600",
  },
  green: {
    box: "bg-green-50",
    icon: "text-green-600",
  },
  purple: {
    box: "bg-purple-50",
    icon: "text-purple-600",
  },
  neutral: {
    box: "bg-neutral-100",
    icon: "text-neutral-600",
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
}

export function SettingsCard({
  icon,
  title,
  description,
  accent = "blue",
  className,
  onClick,
}: SettingsCardProps) {
  const tone = accents[accent];
  const Component = onClick ? "button" : "article";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={clsx(
        "flex w-full flex-col rounded-xl border border-neutral-200 bg-white p-6 text-left shadow-sm transition-colors",
        onClick && "hover:border-neutral-300 hover:bg-neutral-50/50",
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
      <h3 className="preset-body_16/24 mt-4 font-bold text-neutral-900">{title}</h3>
      <p className="preset-body_14/20 mt-1 text-neutral-500">{description}</p>
    </Component>
  );
}
