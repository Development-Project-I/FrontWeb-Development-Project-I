import { useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { InventoryStatCard } from "../../components/Cards/InventoryStatCard";
import { StockFilters } from "../../components/Cards/StockFilters";
import {
  StockTable,
  type ExpirationTone,
  type StockProductRow,
} from "../../components/Cards/StockTable";
import {
  AddStockItemModal,
  type AddStockItemPayload,
} from "../../components/Modals/AddStockItemModal";
import {
  EditStockItemModal,
  type EditStockItemPayload,
} from "../../components/Modals/EditStockItemModal";
import { useToast } from "../../contexts/ToastContext";
import { Text } from "../../components/Text";
import {
  applyQuantityAndStatus,
  applyRowPresentation,
  computeExpirationMeta,
  computeStockStatus,
  isoToBr,
  mergeStockAddition,
  normalizeStockName,
  parseDateBr,
  resolveMinStock,
} from "../../utils/stockRow";

const mockProducts: StockProductRow[] = [
  {
    id: "1",
    name: "Açúcar",
    unit: "kg",
    category: "Farináceos",
    batch: "AC2024-101",
    quantity: 200,
    expirationDate: "09/03/2027",
    expirationLabel: "293 dias",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "2",
    name: "Alho",
    unit: "kg",
    category: "Temperos",
    batch: "TP2024-033",
    quantity: 15,
    expirationDate: "24/04/2026",
    expirationLabel: "Vencido",
    expirationTone: "red",
    status: "Baixo",
    rowVariant: "expired",
    clockTone: "red",
  },
  {
    id: "3",
    name: "Azeite Extra Virgem",
    unit: "L",
    category: "Óleos",
    batch: "AZ2024-012",
    quantity: 45,
    expirationDate: "14/01/2027",
    expirationLabel: "239 dias",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "4",
    name: "Batata",
    unit: "kg",
    category: "Vegetais",
    batch: "VG2024-189",
    quantity: 90,
    expirationDate: "04/05/2026",
    expirationLabel: "Vencido",
    expirationTone: "red",
    status: "OK",
    rowVariant: "expired",
    clockTone: "red",
  },
  {
    id: "5",
    name: "Cebola",
    unit: "kg",
    category: "Vegetais",
    batch: "VG2024-157",
    quantity: 120,
    expirationDate: "21/05/2026",
    expirationLabel: "1 dia",
    expirationTone: "amber",
    status: "OK",
    rowVariant: "warning",
    clockTone: "amber",
  },
  {
    id: "6",
    name: "Creme de Leite",
    unit: "L",
    category: "Laticínios",
    batch: "LT2024-044",
    quantity: 8,
    expirationDate: "18/04/2026",
    expirationLabel: "Vencido",
    expirationTone: "red",
    status: "Baixo",
    rowVariant: "expired",
    clockTone: "red",
  },
  {
    id: "7",
    name: "Filé Mignon",
    unit: "kg",
    category: "Carnes",
    batch: "CR2024-221",
    quantity: 12,
    expirationDate: "20/04/2026",
    expirationLabel: "Vencido",
    expirationTone: "red",
    status: "Baixo",
    rowVariant: "expired",
    clockTone: "red",
  },
  {
    id: "8",
    name: "Frango",
    unit: "kg",
    category: "Carnes",
    batch: "CR2024-198",
    quantity: 25,
    expirationDate: "22/04/2026",
    expirationLabel: "Vencido",
    expirationTone: "red",
    status: "OK",
    rowVariant: "expired",
    clockTone: "red",
  },
  {
    id: "9",
    name: "Farinha de Trigo",
    unit: "kg",
    category: "Farináceos",
    batch: "AC2024-102",
    quantity: 150,
    expirationDate: "10/08/2026",
    expirationLabel: "112 dias",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "10",
    name: "Leite Integral",
    unit: "L",
    category: "Laticínios",
    batch: "LT2024-031",
    quantity: 60,
    expirationDate: "25/05/2026",
    expirationLabel: "5 dias",
    expirationTone: "amber",
    status: "OK",
    rowVariant: "warning",
    clockTone: "amber",
  },
  {
    id: "11",
    name: "Manteiga",
    unit: "kg",
    category: "Laticínios",
    batch: "LT2024-055",
    quantity: 30,
    expirationDate: "30/06/2026",
    expirationLabel: "71 dias",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "12",
    name: "Ovos",
    unit: "dúzia",
    category: "Laticínios",
    batch: "OV2024-128",
    quantity: 0,
    expirationDate: "20/05/2026",
    expirationLabel: "Em falta",
    expirationTone: "red",
    status: "Baixo",
    rowVariant: "expired",
    clockTone: "red",
  },
  {
    id: "13",
    name: "Pimenta do Reino",
    unit: "kg",
    category: "Temperos",
    batch: "TP2024-041",
    quantity: 5,
    expirationDate: "15/12/2026",
    expirationLabel: "209 dias",
    expirationTone: "green",
    status: "Baixo",
    rowVariant: "default",
  },
  {
    id: "14",
    name: "Sal",
    unit: "kg",
    category: "Temperos",
    batch: "TP2024-001",
    quantity: 80,
    expirationDate: "01/01/2028",
    expirationLabel: "425 dias",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "15",
    name: "Tomate",
    unit: "kg",
    category: "Vegetais",
    batch: "VG2024-142",
    quantity: 0,
    expirationDate: "19/05/2026",
    expirationLabel: "Em falta",
    expirationTone: "red",
    status: "Baixo",
    rowVariant: "expired",
    clockTone: "red",
  },
  {
    id: "16",
    name: "Vinagre",
    unit: "L",
    category: "Temperos",
    batch: "TP2024-019",
    quantity: 22,
    expirationDate: "03/09/2026",
    expirationLabel: "106 dias",
    expirationTone: "green",
    status: "OK",
    rowVariant: "default",
  },
  {
    id: "17",
    name: "Óleo de Soja",
    unit: "L",
    category: "Óleos",
    batch: "AZ2024-008",
    quantity: 18,
    expirationDate: "12/05/2026",
    expirationLabel: "3 dias",
    expirationTone: "amber",
    status: "Baixo",
    rowVariant: "warning",
    clockTone: "amber",
  },
  {
    id: "18",
    name: "Queijo Mussarela",
    unit: "kg",
    category: "Laticínios",
    batch: "LT2024-077",
    quantity: 14,
    expirationDate: "28/04/2026",
    expirationLabel: "Vencido",
    expirationTone: "red",
    status: "Baixo",
    rowVariant: "expired",
    clockTone: "red",
  },
];

function normalizeProductRow(row: StockProductRow): StockProductRow {
  const minStock = resolveMinStock(row);
  const expiration = computeExpirationMeta(row.expirationDate, row.quantity);

  return applyRowPresentation({
    ...row,
    minStock,
    status: computeStockStatus(row.quantity, minStock),
    ...expiration,
  });
}

function buildStockRow(payload: AddStockItemPayload): StockProductRow {
  const qty = payload.quantity;
  const min = payload.minStock;
  const expirationDateBr = isoToBr(payload.expirationDate);
  const expiration = computeExpirationMeta(expirationDateBr, qty);
  const status = computeStockStatus(qty, min);

  const batch =
    payload.batch.trim() ||
    `GP${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;

  return applyRowPresentation({
    id: crypto.randomUUID(),
    name: payload.name.trim(),
    unit: payload.unit,
    category: payload.category,
    batch,
    quantity: qty,
    minStock: min,
    status,
    ...expiration,
  });
}

function expirationBaseTone(item: StockProductRow): ExpirationTone {
  return computeExpirationMeta(item.expirationDate, item.quantity).expirationTone;
}

function matchesValidity(item: StockProductRow, validity: string): boolean {
  if (validity === "all") return true;

  const baseTone = expirationBaseTone(item);

  if (validity === "expired") {
    return baseTone === "red";
  }
  if (validity === "soon") {
    return baseTone === "amber";
  }
  if (validity === "ok") {
    return baseTone === "green";
  }
  return true;
}

function findMatchingProduct(
  products: StockProductRow[],
  payload: AddStockItemPayload,
): StockProductRow | undefined {
  const key = normalizeStockName(payload.name);
  const byNameAndUnit = products.filter(
    (p) => normalizeStockName(p.name) === key && p.unit === payload.unit,
  );
  if (byNameAndUnit.length === 0) return undefined;

  return (
    byNameAndUnit.find(
      (p) => p.category === payload.category,
    ) ?? byNameAndUnit[0]
  );
}

export function Estoque() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<StockProductRow[]>(() =>
    mockProducts.map(normalizeProductRow),
  );
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StockProductRow | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [validity, setValidity] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const summary = useMemo(() => {
    const validityAlerts = products.filter((p) => {
      const tone = expirationBaseTone(p);
      return tone === "red" || tone === "amber";
    }).length;
    const missingItems = products.filter((p) => p.quantity === 0).length;
    const lowStock = products.filter((p) => p.status === "Baixo").length;

    return {
      total: products.length,
      validityAlerts,
      missingItems,
      lowStock,
    };
  }, [products]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();

    let list = products.filter((item) => {
      const matchesSearch =
        term.length === 0 ||
        item.name.toLowerCase().includes(term) ||
        item.unit.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.batch.toLowerCase().includes(term);

      const matchesCategory =
        category === "all" || item.category === category;

      return matchesSearch && matchesCategory && matchesValidity(item, validity);
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "quantity") return b.quantity - a.quantity;
      if (sortBy === "expiration") {
        return parseDateBr(a.expirationDate) - parseDateBr(b.expirationDate);
      }
      return a.name.localeCompare(b.name, "pt-BR");
    });

    return list;
  }, [products, search, category, validity, sortBy]);

  function handleAddItem(payload: AddStockItemPayload) {
    let merged = false;
    let toastTitle = "Item adicionado";
    let toastMessage = `${payload.name.trim()} foi cadastrado no estoque.`;

    setProducts((prev) => {
      const existing = findMatchingProduct(prev, payload);

      if (existing) {
        merged = true;
        const updated = mergeStockAddition(existing, payload);
        toastTitle = "Estoque atualizado";
        toastMessage = `+${payload.quantity} ${payload.unit} em ${updated.name}. Total: ${updated.quantity} ${updated.unit}. Validade: ${updated.expirationDate}.`;
        return prev.map((p) => (p.id === existing.id ? updated : p));
      }

      return [...prev, buildStockRow(payload)];
    });

    showToast(toastTitle, toastMessage, "success");
  }

  function handleEditProduct(productId: string, payload: EditStockItemPayload) {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updated = applyQuantityAndStatus(
          {
            ...p,
            name: payload.name.trim(),
            category: payload.category,
            unit: payload.unit,
          },
          p.quantity,
          payload.minStock,
        );
        return updated;
      }),
    );
    showToast(
      "Alterações salvas",
      `${payload.name.trim()} foi atualizado.`,
      "success",
    );
  }

  function openEditModal(row: StockProductRow) {
    setEditingProduct(row);
    setEditOpen(true);
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <Text preset="headline_32/40" fontWeight="bold" color="black">
          Estoque
        </Text>
        <Button
          title="Adicionar Item"
          icon="Plus"
          color="bg-primary text-white hover:brightness-110 active:brightness-95"
          className="shrink-0"
          onClick={() => setAddOpen(true)}
        />
      </div>

      <AddStockItemModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAddItem}
      />

      <EditStockItemModal
        isOpen={editOpen}
        product={editingProduct}
        onClose={() => {
          setEditOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleEditProduct}
      />

      <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InventoryStatCard
          icon="Package"
          label="Total de Itens"
          value={summary.total}
          accent="blue"
        />
        <InventoryStatCard
          icon="XCircle"
          label="Alertas Validade"
          value={summary.validityAlerts}
          accent="red"
        />
        <InventoryStatCard
          icon="AlertTriangle"
          label="Itens em Falta"
          value={summary.missingItems}
          accent="red"
        />
        <InventoryStatCard
          icon="AlertTriangle"
          label="Estoque Baixo"
          value={summary.lowStock}
          accent="amber"
        />
      </div>

      <StockFilters
        className="mt-8"
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        validity={validity}
        onValidityChange={setValidity}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      <StockTable
        className="mt-6"
        rows={filteredRows}
        onEdit={openEditModal}
      />
    </div>
  );
}
