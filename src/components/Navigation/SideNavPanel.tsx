import clsx from "clsx";
import { SideNav } from "./SideNav";

export interface SideNavPanelProps {
  onNavigate?: () => void;
  className?: string;
}

export function SideNavPanel({ onNavigate, className }: SideNavPanelProps) {
  return (
    <div className={clsx("flex h-full flex-col", className)}>
      <div className="px-2">
        <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-slate-100">
          GastroPlan
        </span>
      </div>
      <SideNav onNavigate={onNavigate} className="mt-10" />
    </div>
  );
}
