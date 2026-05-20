import clsx from "clsx";
import { Icon } from "../../Icon";
import { Text } from "../../Text";

export interface CardHeaderProps {
  title: string;
  icon?: string;
  totalAlerts?: number;
  badgeSuffix?: string;
  iconColor?: string;
  iconClassName?: string;
}

export function CardHeader({
  title,
  icon,
  totalAlerts,
  badgeSuffix = "alertas",
  iconColor = "text-red-600",
  iconClassName,
}: CardHeaderProps) {
  return (
    <header className="flex items-start gap-3 border-b border-neutral-100 pb-5">
      {icon ? (
        <Icon
          name={icon}
          color={iconColor}
          className={clsx("mt-0.5 size-6 shrink-0", iconClassName)}
          strokeWidth={2}
          aria-hidden
        />
      ) : null}
      <div className="min-w-0 flex-1">
        <Text preset="headline_18/24" color="black">
          {title}
        </Text>
      </div>
      {totalAlerts != null ? (
        <span className="preset-tag_12/16 shrink-0 rounded-full bg-rose-100 px-3 py-1.5 font-semibold text-red-900">
          {totalAlerts} {badgeSuffix}
        </span>
      ) : null}
    </header>
  );
}
