import { Button } from "../../components/Button";
import { ReportStatCard } from "../../components/Cards/ReportStatCard";
import type { ReportStatAccent } from "../../components/Cards/ReportStatCard";
import { ReportsTable } from "../../components/Cards/ReportsTable";
import { Text } from "../../components/Text";

interface ReportSummaryItem {
  id: string;
  label: string;
  value: string | number;
  icon: string;
  accent: ReportStatAccent;
}

const summaryItems: ReportSummaryItem[] = [
  {
    id: "1",
    label: "Total de Relatórios",
    value: 4,
    icon: "FileText",
    accent: "blue",
  },
  {
    id: "2",
    label: "Este Mês",
    value: 3,
    icon: "TrendingUp",
    accent: "green",
  },
  {
    id: "3",
    label: "Último Relatório",
    value: "09/04/2026",
    icon: "Calendar",
    accent: "purple",
  },
];

export function Relatorios() {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <Text preset="headline_32/40" fontWeight="bold" color="black">
          Relatórios
        </Text>
        <Button
          title="Gerar Novo Relatório"
          icon="Plus"
          color="bg-primary text-white hover:brightness-110 active:brightness-95"
          className="shrink-0"
        />
      </div>

      <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaryItems.map((item) => (
          <ReportStatCard
            key={item.id}
            icon={item.icon}
            label={item.label}
            value={item.value}
            accent={item.accent}
          />
        ))}
      </div>

      <ReportsTable className="mt-8" />
    </div>
  );
}
