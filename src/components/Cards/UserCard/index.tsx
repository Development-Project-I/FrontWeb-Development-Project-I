import clsx from "clsx";
import { Icon } from "../../Icon";

const accents = {
  blue: {
    box: "bg-blue-50",
    icon: "text-blue-600",
  },
  purple: {
    box: "bg-purple-50",
    icon: "text-purple-600",
  },
  indigo: {
    box: "bg-indigo-50",
    icon: "text-indigo-600",
  },
} as const;

export type UserCardAccent = keyof typeof accents;

export interface UserCardProps {
  icon: string;
  label: string;
  value: string | number;
  accent?: UserCardAccent;
  isLoading?: boolean;
  className?: string;
}

export function UserCard({
  icon,
  label,
  value,
  accent = "blue",
  isLoading = false,
  className,
}: UserCardProps) {
  const tone = accents[accent];

  return (
    <article
      className={clsx(
        "flex flex-row items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm",
        className,
      )}
    >
      <div
        className={clsx(
          "flex size-11 shrink-0 items-center justify-center rounded-lg",
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
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="preset-body_14/20 font-regular text-neutral-500">{label}</p>
        <p
          className={clsx(
            "preset-headline_20/25 font-bold text-neutral-900 transition-[filter]",
            isLoading && "select-none blur-md",
          )}
          aria-busy={isLoading}
        >
          {value}
        </p>
      </div>
    </article>
  );
}
