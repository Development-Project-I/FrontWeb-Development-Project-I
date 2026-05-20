import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import { Icon } from "../Icon";

export interface ButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
  title: string;
  icon: string;
  color: string;
}

export function Button({
  title,
  icon,
  color,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        "preset-button_16/24 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        color,
        className,
      )}
      {...rest}
    >
      <Icon
        name={icon}
        className="size-4 shrink-0"
        color="text-current"
        strokeWidth={2}
        aria-hidden
      />
      <span>{title}</span>
    </button>
  );
}
