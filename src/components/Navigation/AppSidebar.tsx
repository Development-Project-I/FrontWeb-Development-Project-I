import { SideNavPanel } from "./SideNavPanel";

export function AppSidebar() {
  return (
    <aside className="sticky top-0 z-30 hidden h-screen w-[260px] shrink-0 flex-col overflow-y-auto border-r border-neutral-200 bg-white px-4 py-8 lg:flex dark:border-slate-700 dark:bg-slate-900">
      <SideNavPanel />
    </aside>
  );
}
