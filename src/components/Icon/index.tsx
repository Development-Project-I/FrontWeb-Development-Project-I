import clsx from "clsx";
import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { ElementType } from "react";

const excludedKeys = new Set([
  "createLucideIcon",
  "default",
  "Icon",
]);

export type LucideIconName = Exclude<
  keyof typeof LucideIcons,
  "createLucideIcon" | "default" | "Icon"
>;

export interface IconProps extends LucideProps {
  name: string;
  color?: string;
}

export function Icon({ name, color, className, ...props }: IconProps) {
  if (excludedKeys.has(name)) {
    return null;
  }

  const Cmp = LucideIcons[name as LucideIconName] as ElementType | undefined;

  if (Cmp == null) {
    if (import.meta.env.DEV) {
      console.warn(`[Icon] Ícone não encontrado: "${name}"`);
    }
    return null;
  }

  return (
    <Cmp
      className={clsx(color, className)}
      {...(props as LucideProps)}
    />
  );
}
