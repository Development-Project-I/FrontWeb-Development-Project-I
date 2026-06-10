import clsx from "clsx";
import type { FormEvent } from "react";
import { useCallback, useEffect, useId, useState } from "react";
import {
  STOCK_CATEGORIES,
  STOCK_UNITS,
  type StockCategory,
  type StockUnit,
} from "../../../constants/inventory";
import { useToast } from "../../../contexts/ToastContext";
import { inventoryService } from "../../../services/inventory.service";
import { Button } from "../../Button";
import { Icon } from "../../Icon";

export interface AddStockItemPayload {
  name: string;
  category: StockCategory;
  unit: StockUnit;
  quantity: number;
  minStock: number;
  expirationDate: string;
  batch: string;
}

export interface AddStockItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputClass =
  "w-full rounded-lg border border-neutral-200 py-2.5 text-sm text-neutral-900 outline-none ring-primary/30 placeholder:text-neutral-400 focus:border-primary focus:ring-2";

const selectClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none ring-primary/30 focus:border-primary focus:ring-2";

export function AddStockItemModal({
  isOpen,
  onClose,
  onSuccess,
}: AddStockItemModalProps) {
  const { showToast } = useToast();
  const baseId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<StockCategory>(STOCK_CATEGORIES[0]);
  const [unit, setUnit] = useState<StockUnit>("kg");
  const [quantity, setQuantity] = useState("");
  const [minStock, setMinStock] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [batch, setBatch] = useState("");

  const reset = useCallback(() => {
    setName("");
    setCategory(STOCK_CATEGORIES[0]);
    setUnit("kg");
    setQuantity("");
    setMinStock("");
    setExpirationDate("");
    setBatch("");
  }, []);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

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

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const trimmedName = name.trim();
      const qty = Number(quantity);

      if (!trimmedName) {
        showToast("Campos obrigatórios", "Informe o nome do item.", "warning");
        return;
      }

      if (!category) {
        showToast("Campos obrigatórios", "Selecione uma categoria.", "warning");
        return;
      }

      if (!expirationDate) {
        showToast(
          "Campos obrigatórios",
          "Informe a data de validade.",
          "warning",
        );
        return;
      }

      const min = Number(minStock);

      if (Number.isNaN(qty) || qty < 0) {
        showToast(
          "Campos obrigatórios",
          "Informe uma quantidade válida.",
          "warning",
        );
        return;
      }

      if (Number.isNaN(min) || min < 0) {
        showToast(
          "Campos obrigatórios",
          "Informe o estoque mínimo.",
          "warning",
        );
        return;
      }

      setIsSubmitting(true);

      try {
        await inventoryService.postInventory({
          name: trimmedName,
          category,
          quantity: qty,
          expiryDate: expirationDate,
          unit,
          minStock: min,
          batchNumber: batch.trim() || undefined,
        });

        showToast(
          "Item adicionado",
          `${trimmedName} foi cadastrado no estoque.`,
          "success",
        );
        onSuccess?.();
        onClose();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível cadastrar o item no estoque.";
        showToast("Erro ao cadastrar", message, "error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      batch,
      category,
      expirationDate,
      minStock,
      name,
      onSuccess,
      onClose,
      quantity,
      showToast,
      unit,
    ],
  );

  if (!isOpen) return null;

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
        className="relative z-[101] flex max-h-[min(92vh,900px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
        onClick={(ev) => ev.stopPropagation()}
      >
        <header className="shrink-0 border-b border-neutral-200 px-6 pb-4 pt-6 dark:border-slate-700">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-green-50 dark:bg-green-950/50">
                <Icon
                  name="Package"
                  color="text-green-600"
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
                  Adicionar Novo Item
                </h2>
                <p
                  id={`${baseId}-desc`}
                  className="preset-body_14/20 mt-1 font-regular text-neutral-500"
                >
                  Cadastre um novo item no estoque
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
                placeholder="Ex: Farinha de Trigo"
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
                  Unidade de Medida
                </label>
                <select
                  id={`${baseId}-unidade`}
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
                  Quantidade Inicial <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Icon
                    name="Hash"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <input
                    id={`${baseId}-quantidade`}
                    type="number"
                    required
                    min={0}
                    step="any"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    className={clsx(inputClass, "pl-10 pr-3")}
                  />
                </div>
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
                    placeholder="0"
                    className={clsx(inputClass, "pl-10 pr-3")}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${baseId}-validade`}
                  className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
                >
                  Data de Validade <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Icon
                    name="Calendar"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <input
                    id={`${baseId}-validade`}
                    type="date"
                    required
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className={clsx(inputClass, "pl-10 pr-3")}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-lote`}
                  className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
                >
                  Número do Lote
                </label>
                <div className="relative">
                  <Icon
                    name="Tag"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <input
                    id={`${baseId}-lote`}
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    placeholder="Ex: FT2024-045"
                    className={clsx(inputClass, "pl-10 pr-3")}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-4 dark:border-slate-600 dark:bg-slate-800/80">
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
                </div>
              </div>
            </div>
          </div>

          <footer className="flex shrink-0 flex-col-reverse gap-3 bg-white px-6 pb-5 pt-4 dark:bg-slate-900 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onClose}
              className="preset-button_16/24 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 sm:w-auto"
            >
              Cancelar
            </button>
            <Button
              type="submit"
              title={isSubmitting ? "Salvando..." : "Adicionar ao Estoque"}
              icon="Plus"
              color="bg-primary text-white hover:brightness-110 active:brightness-95"
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            />
          </footer>
        </form>
      </div>
    </div>
  );
}
