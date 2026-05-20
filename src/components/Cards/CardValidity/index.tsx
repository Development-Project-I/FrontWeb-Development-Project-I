import clsx from "clsx";
import { CardHeader } from "../CardHeader";
import { Icon } from "../../Icon";

export interface ValidityAlertItem {
  id: string;
  name: string;
  expiredOn: string;
  daysAgo: number;
  batch: string;
  stockUnits: number;
}

export interface UpcomingValidityItem {
  id: string;
  name: string;
  expiresOn: string;
  daysUntil: number;
  batch: string;
  stockUnits: number;
}

export interface CardValidityProps {
  totalAlerts?: number;
  expiredCount?: number;
  items?: ValidityAlertItem[];
  upcomingCount?: number;
  upcomingItems?: UpcomingValidityItem[];
  className?: string;
}

const defaultItems: ValidityAlertItem[] = [
  {
    id: "1",
    name: "Ovos (dúzia)",
    expiredOn: "19/04/2026",
    daysAgo: 4,
    batch: "OV2024-128",
    stockUnits: 25,
  },
  {
    id: "2",
    name: "Tomate (kg)",
    expiredOn: "18/04/2026",
    daysAgo: 5,
    batch: "TM2024-042",
    stockUnits: 12,
  },
  {
    id: "3",
    name: "Filé Mignon (kg)",
    expiredOn: "15/04/2026",
    daysAgo: 8,
    batch: "FM2024-009",
    stockUnits: 3,
  },
  {
    id: "4",
    name: "Frango (kg)",
    expiredOn: "12/04/2026",
    daysAgo: 11,
    batch: "FG2024-031",
    stockUnits: 8,
  },
  {
    id: "5",
    name: "Leite integral (L)",
    expiredOn: "10/04/2026",
    daysAgo: 13,
    batch: "LT2024-204",
    stockUnits: 40,
  },
];

const defaultUpcoming: UpcomingValidityItem[] = [
  {
    id: "u1",
    name: "Queijo mussarela (kg)",
    expiresOn: "24/04/2026",
    daysUntil: 1,
    batch: "QZ2024-088",
    stockUnits: 6,
  },
];

export function CardValidity({
  totalAlerts = 8,
  expiredCount = 7,
  items = defaultItems,
  upcomingCount = 1,
  upcomingItems = defaultUpcoming,
  className,
}: CardValidityProps) {
  return (
    <section
      className={clsx(
        "flex h-[500px] w-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm",
        className,
      )}
      aria-labelledby="card-validity-title"
    >
      <div className="shrink-0">
        <CardHeader
          title="Alertas de Validade"
          icon="AlertTriangle"
          iconColor="text-red-600"
          totalAlerts={totalAlerts}
        />
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-y-contain pr-1">
        <div className="flex items-center gap-2">
          <Icon
            name="XCircle"
            color="text-red-600"
            className="size-5 shrink-0"
            strokeWidth={2}
            aria-hidden
          />
          <h3 className="preset-body_16/24 font-bold text-red-900">
            Vencidos ({expiredCount})
          </h3>
        </div>

        <ul className="mt-3 list-none space-y-3 p-0">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-red-200 bg-red-50/90 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="preset-body_16/24 font-bold text-red-900">
                  {item.name}
                </p>
                <span className="preset-tag_12/16 shrink-0 rounded-full bg-red-100 px-2.5 py-1 font-bold uppercase tracking-wide text-red-900">
                  Vencido
                </span>
              </div>
              <p className="mt-3 preset-body_14/20 font-regular text-red-900">
                Venceu em {item.expiredOn} • {item.daysAgo} dia(s) atrás
              </p>
              <p className="mt-1 preset-body_14/20 font-regular text-red-900">
                Lote: {item.batch}
              </p>
              <p className="mt-1 preset-body_14/20 font-regular text-red-900">
                Estoque: {item.stockUnits} unidades
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center gap-2">
          <Icon
            name="Clock"
            color="text-amber-500"
            className="size-5 shrink-0"
            strokeWidth={2}
            aria-hidden
          />
          <h3 className="preset-body_16/24 font-bold text-amber-900">
            Próximos 3 Dias ({upcomingCount})
          </h3>
        </div>

        <ul className="mt-3 list-none space-y-3 p-0 pb-1">
          {upcomingItems.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-amber-200 bg-amber-50/90 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="preset-body_16/24 font-bold text-amber-950">
                  {item.name}
                </p>
                <span className="preset-tag_12/16 shrink-0 rounded-full bg-amber-100 px-2.5 py-1 font-bold text-amber-950">
                  {item.daysUntil}D
                </span>
              </div>
              <p className="mt-3 preset-body_14/20 font-regular text-amber-950">
                Vence em {item.expiresOn} • em {item.daysUntil} dia(s)
              </p>
              <p className="mt-1 preset-body_14/20 font-regular text-amber-950">
                Lote: {item.batch}
              </p>
              <p className="mt-1 preset-body_14/20 font-regular text-amber-950">
                Estoque: {item.stockUnits} unidades
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
