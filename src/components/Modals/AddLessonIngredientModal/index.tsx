import clsx from "clsx";
import type { FormEvent } from "react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { STOCK_UNITS, type StockUnit } from "../../../constants/inventory";
import type { StockCatalogItem } from "../../../data/stock";
import { Button } from "../../Button";
import { Icon } from "../../Icon";

export interface AddLessonIngredientPayload {
  stockId: string;
  required: number;
  requiredUnit: StockUnit;
}

export interface AddLessonIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockItems: StockCatalogItem[];
  excludedStockIds?: string[];
  onAdd?: (payload: AddLessonIngredientPayload) => void;
}

const selectClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none ring-primary/30 focus:border-primary focus:ring-2";

const inputClass =
  "w-full rounded-lg border border-neutral-200 py-2.5 text-sm text-neutral-900 outline-none ring-primary/30 placeholder:text-neutral-400 focus:border-primary focus:ring-2";

function normalizeTerm(value: string) {
  return value.trim().toLowerCase();
}

export function AddLessonIngredientModal({
  isOpen,
  onClose,
  stockItems,
  excludedStockIds = [],
  onAdd,
}: AddLessonIngredientModalProps) {
  const baseId = useId();
  const [stockId, setStockId] = useState("");
  const [nameQuery, setNameQuery] = useState("");
  const [appliedName, setAppliedName] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [required, setRequired] = useState("");
  const [requiredUnit, setRequiredUnit] = useState<StockUnit>("unidade");

  const availableItems = useMemo(
    () => stockItems.filter((item) => !excludedStockIds.includes(item.id)),
    [stockItems, excludedStockIds],
  );

  const filteredItems = useMemo(() => {
    if (!hasSearched) return [];
    const term = normalizeTerm(appliedName);
    if (!term) return [];
    return availableItems.filter((item) =>
      item.name.toLowerCase().includes(term),
    );
  }, [availableItems, appliedName, hasSearched]);

  const selected = useMemo(
    () => availableItems.find((item) => item.id === stockId),
    [availableItems, stockId],
  );

  const reset = useCallback(() => {
    setStockId("");
    setNameQuery("");
    setAppliedName("");
    setHasSearched(false);
    setRequired("");
    setRequiredUnit("unidade");
  }, []);

  function handleSearch() {
    setAppliedName(nameQuery);
    setHasSearched(true);
  }

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

  function selectItem(item: StockCatalogItem) {
    setStockId(item.id);
    setRequiredUnit(item.unit as StockUnit);
  }

  if (!isOpen) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stockId || !selected) return;
    onAdd?.({
      stockId,
      required: Number(required) || 0,
      requiredUnit,
    });
    onClose();
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
        className="relative z-[101] flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
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
                  Adicionar Ingrediente
                </h2>
                <p
                  id={`${baseId}-desc`}
                  className="preset-body_14/20 mt-1 font-regular text-neutral-500"
                >
                  Digite o nome do produto e clique em Buscar
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

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="space-y-5 px-6 py-5">
            {availableItems.length === 0 ? (
              <p className="preset-body_14/20 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-neutral-600">
                Todos os itens do estoque já foram adicionados a esta aula.
              </p>
            ) : (
              <>
                <div>
                  <label
                    htmlFor={`${baseId}-name`}
                    className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
                  >
                    Buscar item <span className="text-primary">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      id={`${baseId}-name`}
                      type="text"
                      value={nameQuery}
                      onChange={(e) => setNameQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSearch();
                        }
                      }}
                      placeholder="Nome do produto..."
                      className={clsx(inputClass, "min-w-0 flex-1 px-3")}
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="shrink-0 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                    >
                      Buscar
                    </button>
                  </div>

                  <ul
                    className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-neutral-200"
                    role="listbox"
                    aria-label="Itens do estoque"
                  >
                    {!hasSearched ? (
                      <li className="preset-body_14/20 px-3 py-3 text-neutral-500">
                        Digite o nome e clique em Buscar.
                      </li>
                    ) : !normalizeTerm(appliedName) ? (
                      <li className="preset-body_14/20 px-3 py-3 text-neutral-500">
                        Informe o nome do produto para buscar.
                      </li>
                    ) : filteredItems.length === 0 ? (
                      <li className="preset-body_14/20 px-3 py-3 text-neutral-500">
                        Nenhum item encontrado para &quot;{appliedName.trim()}&quot;.
                      </li>
                    ) : (
                      filteredItems.map((item) => {
                        const isSelected = item.id === stockId;
                        return (
                          <li key={item.id} role="presentation">
                            <button
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => selectItem(item)}
                              className={clsx(
                                "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                                isSelected
                                  ? "bg-blue-50 text-primary"
                                  : "text-neutral-800 hover:bg-neutral-50",
                              )}
                            >
                              <span>
                                <span className="font-medium">{item.name}</span>
                                <span className="ml-2 text-neutral-500">
                                  · {item.category}
                                </span>
                              </span>
                              <span className="shrink-0 text-xs text-neutral-500">
                                {item.quantity} {item.unit}
                              </span>
                            </button>
                          </li>
                        );
                      })
                    )}
                  </ul>
                  {selected ? (
                    <p className="preset-body_12/16 mt-1.5 text-neutral-500">
                      Selecionado:{" "}
                      <span className="font-semibold text-neutral-800">
                        {selected.name}
                      </span>{" "}
                      ({selected.category})
                    </p>
                  ) : (
                    <p className="preset-body_12/16 mt-1.5 text-amber-700">
                      Selecione um item na lista acima.
                    </p>
                  )}
                </div>

                <div>
                  <span className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800">
                    Quantidade necessária <span className="text-primary">*</span>
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Icon
                        name="Hash"
                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                        strokeWidth={2}
                        aria-hidden
                      />
                      <input
                        id={`${baseId}-qtd`}
                        type="number"
                        required
                        min={0.01}
                        step="any"
                        value={required}
                        onChange={(e) => setRequired(e.target.value)}
                        placeholder="0"
                        className={clsx(inputClass, "pl-10 pr-3")}
                      />
                    </div>
                    <select
                      id={`${baseId}-unit`}
                      required
                      value={requiredUnit}
                      onChange={(e) => setRequiredUnit(e.target.value as StockUnit)}
                      className={selectClass}
                      aria-label="Unidade de medida da quantidade necessária"
                    >
                      {STOCK_UNITS.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selected ? (
                    <p className="preset-body_12/16 mt-1.5 text-neutral-500">
                      Disponível no estoque:{" "}
                      <span className="font-semibold text-neutral-800">
                        {selected.quantity} {selected.unit}
                      </span>
                      {requiredUnit !== selected.unit ? (
                        <span className="text-neutral-400">
                          {" "}
                          (unidade da aula: {requiredUnit})
                        </span>
                      ) : null}
                    </p>
                  ) : null}
                </div>
              </>
            )}
          </div>

          <footer className="flex shrink-0 flex-col-reverse gap-3 bg-white px-6 pb-5 pt-4 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onClose}
              className="preset-button_16/24 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 sm:w-auto"
            >
              Cancelar
            </button>
            <Button
              type="submit"
              title="Adicionar à Aula"
              icon="Plus"
              color="bg-primary text-white hover:brightness-110 active:brightness-95"
              className="w-full sm:w-auto"
              disabled={availableItems.length === 0 || !stockId}
            />
          </footer>
        </form>
      </div>
    </div>
  );
}
