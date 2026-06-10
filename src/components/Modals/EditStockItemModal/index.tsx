import clsx from "clsx";
import type { FormEvent } from "react";
import { useCallback, useEffect, useId, useState } from "react";
import {
  STOCK_CATEGORIES,
  STOCK_UNITS,
  type StockCategory,
  type StockUnit,
} from "../../../constants/inventory";
import type { StockProductRow } from "../../Cards/StockTable";
import { resolveMinStock } from "../../../utils/stockRow";
import { Button } from "../../Button";
import { ConfirmDropdown } from "../../ConfirmDropdown";
import { Icon } from "../../Icon";

export interface EditStockItemPayload {
  name: string;
  category: StockCategory;
  unit: StockUnit;
  minStock: number;
}

export interface EditStockItemModalProps {
  isOpen: boolean;
  product: StockProductRow | null;
  onClose: () => void;
  onSave?: (productId: string, payload: EditStockItemPayload) => void;
  onDelete?: (productId: string) => void | Promise<void>;
}

const inputClass =
  "w-full rounded-lg border border-neutral-200 py-2.5 text-sm text-neutral-900 outline-none ring-primary/30 placeholder:text-neutral-400 focus:border-primary focus:ring-2";

const selectClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none ring-primary/30 focus:border-primary focus:ring-2";

const readOnlyClass =
  "w-full cursor-not-allowed rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-600";

function StockStatusInfoBox() {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-4">
      <div className="flex gap-2">
        <Icon
          name="Info"
          className="mt-0.5 size-5 shrink-0 text-blue-600"
          strokeWidth={2}
          aria-hidden
        />
        <div>
          <p className="preset-body_14/20 font-bold text-neutral-900">
            O status é calculado automaticamente:
          </p>
          <ul className="preset-body_14/20 mt-2 list-disc space-y-1 pl-5 font-regular text-neutral-700">
            <li>
              Quantidade = 0: <span className="font-semibold">Esgotado</span>
            </li>
            <li>
              Quantidade &lt; Estoque Mínimo:{" "}
              <span className="font-semibold">Baixo</span>
            </li>
            <li>
              Quantidade ≥ Estoque Mínimo:{" "}
              <span className="font-semibold">OK</span>
            </li>
          </ul>
          <p className="preset-body_12/16 mt-3 text-neutral-600">
            A quantidade é somada ao adicionar o mesmo item de novo. A validade
            exibida passa a ser a data informada na última entrada. O estoque
            mínimo definido aqui vale nas próximas entradas.
          </p>
        </div>
      </div>
    </div>
  );
}

export function EditStockItemModal({
  isOpen,
  product,
  onClose,
  onSave,
  onDelete,
}: EditStockItemModalProps) {
  const baseId = useId();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<StockCategory>(STOCK_CATEGORIES[0]);
  const [unit, setUnit] = useState<StockUnit>("kg");
  const [minStock, setMinStock] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const syncFromProduct = useCallback(() => {
    if (!product) return;
    setName(product.name);
    setCategory(product.category as StockCategory);
    setUnit(product.unit as StockUnit);
    setMinStock(String(resolveMinStock(product)));
  }, [product]);

  useEffect(() => {
    if (isOpen && product) syncFromProduct();
    if (!isOpen) setDeleteConfirmOpen(false);
  }, [isOpen, product, syncFromProduct]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!product) return;
    onSave?.(product.id, {
      name: name.trim(),
      category,
      unit,
      minStock: Number(minStock) || 0,
    });
    onClose();
  }

  async function handleDelete() {
    if (!product || !onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(product.id);
      setDeleteConfirmOpen(false);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-neutral-950/85 backdrop-blur-[1px]"
        aria-label="Fechar modal"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${baseId}-title`}
        aria-describedby={`${baseId}-desc`}
        className="relative z-[101] flex max-h-[min(92vh,900px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(ev) => ev.stopPropagation()}
      >
        <header className="shrink-0 border-b border-neutral-200 px-6 pb-4 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <Icon
                  name="Package"
                  color="text-blue-600"
                  className="size-6"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>
              <div className="min-w-0">
                <h2
                  id={`${baseId}-title`}
                  className="preset-headline_20/25 font-bold text-neutral-900"
                >
                  Editar Item do Estoque
                </h2>
                <p
                  id={`${baseId}-desc`}
                  className="preset-body_14/20 mt-1 font-regular text-neutral-500"
                >
                  Atualize as informações do item
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
              aria-label="Fechar"
            >
              <Icon name="X" className="size-5" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <div>
              <label
                htmlFor={`${baseId}-nome`}
                className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
              >
                Nome do Item <span className="text-primary">*</span>
              </label>
              <input
                id={`${baseId}-nome`}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={clsx(inputClass, "px-3")}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${baseId}-categoria`}
                  className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
                >
                  Categoria <span className="text-primary">*</span>
                </label>
                <select
                  id={`${baseId}-categoria`}
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value as StockCategory)}
                  className={selectClass}
                >
                  {STOCK_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-unidade`}
                  className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
                >
                  Unidade de Medida <span className="text-primary">*</span>
                </label>
                <select
                  id={`${baseId}-unidade`}
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as StockUnit)}
                  className={selectClass}
                >
                  {STOCK_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${baseId}-quantidade`}
                  className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
                >
                  Quantidade em estoque
                </label>
                <input
                  id={`${baseId}-quantidade`}
                  readOnly
                  value={product.quantity}
                  className={readOnlyClass}
                  aria-readonly
                />
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-minimo`}
                  className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
                >
                  Estoque Mínimo <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Icon
                    name="TrendingDown"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <input
                    id={`${baseId}-minimo`}
                    type="number"
                    required
                    min={0}
                    step="any"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    className={clsx(inputClass, "pl-10 pr-3")}
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor={`${baseId}-lote`}
                className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
              >
                Lote
              </label>
              <input
                id={`${baseId}-lote`}
                readOnly
                value={product.batch}
                className={readOnlyClass}
                aria-readonly
              />
            </div>

            <div>
              <label
                htmlFor={`${baseId}-validade`}
                className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
              >
                Data de Validade
              </label>
              <input
                id={`${baseId}-validade`}
                readOnly
                value={product.expirationDate}
                className={readOnlyClass}
                aria-readonly
              />
            </div>

            <StockStatusInfoBox />
          </div>

          <footer className="flex shrink-0 flex-col-reverse gap-3 bg-white px-6 pb-5 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="preset-button_16/24 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:opacity-50 sm:w-auto"
            >
              Cancelar
            </button>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              {onDelete ? (
                <div className="relative w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmOpen(true)}
                    disabled={isDeleting}
                    className="preset-button_16/24 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 font-semibold text-red-600 shadow-sm transition hover:bg-red-50 disabled:opacity-50 sm:w-auto"
                    aria-label={`Excluir ${product.name}`}
                  >
                    <Icon
                      name="Trash2"
                      className="size-4 shrink-0"
                      strokeWidth={2}
                      aria-hidden
                    />
                    {isDeleting ? "Excluindo..." : "Excluir"}
                  </button>
                  <ConfirmDropdown
                    isOpen={deleteConfirmOpen}
                    onClose={() => setDeleteConfirmOpen(false)}
                    onConfirm={() => void handleDelete()}
                    message={`Deseja excluir "${product.name}" do estoque? Esta ação não pode ser desfeita.`}
                    isLoading={isDeleting}
                    className="!bottom-full !top-auto !mb-2 !mt-0 origin-bottom-right"
                  />
                </div>
              ) : null}
              <Button
                type="submit"
                title="Salvar Alterações"
                icon="Save"
                color="bg-primary text-white hover:brightness-110 active:brightness-95"
                className="w-full sm:w-auto"
                disabled={isDeleting}
              />
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}
