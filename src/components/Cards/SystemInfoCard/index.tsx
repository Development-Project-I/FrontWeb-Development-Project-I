import clsx from "clsx";

export interface SystemInfoItem {
  id: string;
  label: string;
  value: string | number;
}

export interface SystemInfoCardProps {
  title?: string;
  items?: SystemInfoItem[];
  className?: string;
}

const defaultItems: SystemInfoItem[] = [
  { id: "1", label: "Versão", value: "1.0.0" },
  { id: "2", label: "Usuários Ativos", value: 12 },
  { id: "3", label: "Última Atualização", value: "09/04/2026" },
  { id: "4", label: "Espaço Utilizado", value: "2.4 GB / 10 GB" },
];

function InfoItem({ label, value }: Omit<SystemInfoItem, "id">) {
  return (
    <div className="flex flex-col gap-1">
      <span className="preset-body_14/20 text-neutral-500">{label}</span>
      <span className="preset-body_16/24 font-bold text-neutral-900">{value}</span>
    </div>
  );
}

export function SystemInfoCard({
  title = "Informações do Sistema",
  items = defaultItems,
  className,
}: SystemInfoCardProps) {
  const leftColumn = items.slice(0, 2);
  const rightColumn = items.slice(2, 4);

  return (
    <section
      className={clsx(
        "rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900",
        className,
      )}
    >
      <h2 className="preset-headline_18/24 font-bold text-neutral-900">{title}</h2>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          {leftColumn.map((item) => (
            <InfoItem key={item.id} label={item.label} value={item.value} />
          ))}
        </div>
        <div className="flex flex-col gap-6">
          {rightColumn.map((item) => (
            <InfoItem key={item.id} label={item.label} value={item.value} />
          ))}
        </div>
      </div>
    </section>
  );
}
