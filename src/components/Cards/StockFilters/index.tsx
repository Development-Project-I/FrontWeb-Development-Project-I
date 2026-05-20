import clsx from "clsx";
import { STOCK_CATEGORIES } from "../../../constants/inventory";
import { Icon } from "../../Icon";

export interface StockFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  validity: string;
  onValidityChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  className?: string;
}

const selectClass =
  "w-full appearance-none rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none ring-primary/30 focus:border-primary focus:ring-2";

export function StockFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  validity,
  onValidityChange,
  sortBy,
  onSortByChange,
  className,
}: StockFiltersProps) {
  return (
    <section
      className={clsx(
        "rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      <div className="relative">
        <Icon
          name="Search"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
          strokeWidth={2}
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar item..."
          className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-3 text-sm text-neutral-900 outline-none ring-primary/30 placeholder:text-neutral-400 focus:border-primary focus:ring-2"
          aria-label="Buscar item"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={selectClass}
          aria-label="Filtrar por categoria"
        >
          <option value="all">Todas as Categorias</option>
          {STOCK_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={validity}
          onChange={(e) => onValidityChange(e.target.value)}
          className={selectClass}
          aria-label="Filtrar por validade"
        >
          <option value="all">Todas as Validades</option>
          <option value="ok">OK</option>
          <option value="expired">Vencido</option>
          <option value="soon">Próximo do vencimento</option>
        </select>
      </div>

      <div className="mt-3">
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className={selectClass}
          aria-label="Ordenar itens"
        >
          <option value="name">Ordenar por Nome</option>
          <option value="quantity">Ordenar por Quantidade</option>
          <option value="expiration">Ordenar por Validade</option>
        </select>
      </div>
    </section>
  );
}
