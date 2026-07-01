import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { InventoryStatCard } from "../../components/Cards/InventoryStatCard";
import { StockFilters } from "../../components/Cards/StockFilters";
import {
  StockTable,
  type ExpirationTone,
  type StockProductRow,
} from "../../components/Cards/StockTable";
import { AddStockItemModal } from "../../components/Modals/AddStockItemModal";
import {
  EditStockItemModal,
  type EditStockItemPayload,
} from "../../components/Modals/EditStockItemModal";
import { useToast } from "../../contexts/ToastContext";
import { inventoryService } from "../../services/inventory.service";
import { Icon } from "../../components/Icon";
import { PageContainer } from "../../components/Layout/PageContainer";
import { Text } from "../../components/Text";
import { mapInventoryToStockRow } from "../../utils/apiMappers";
import {
  applyQuantityAndStatus,
  parseDateBr,
} from "../../utils/stockRow";
import {
  OPEN_MODAL,
  type AppLocationState,
} from "../../constants/navigationState";

function expirationBaseTone(item: StockProductRow): ExpirationTone {
  return item.expirationTone;
}

function matchesValidity(item: StockProductRow, validity: string): boolean {
  if (validity === "all") return true;
  const baseTone = expirationBaseTone(item);
  if (validity === "expired") return baseTone === "red";
  if (validity === "soon") return baseTone === "amber";
  if (validity === "ok") return baseTone === "green";
  return true;
}

export function Estoque() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [products, setProducts] = useState<StockProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StockProductRow | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [validity, setValidity] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await inventoryService.getInventory();
      setProducts(data.map(mapInventoryToStockRow));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao carregar estoque.";
      showToast("Erro", message, "error");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const state = location.state as AppLocationState | null;
    if (state?.openModal !== OPEN_MODAL.ADD_STOCK_ITEM) return;

    setAddOpen(true);
    navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
  }, [location.pathname, location.search, location.state, navigate]);

  const summary = useMemo(() => {
    const validityAlerts = products.filter((p) => {
      const tone = expirationBaseTone(p);
      return tone === "red" || tone === "amber";
    }).length;
    const missingItems = products.filter((p) => p.quantity === 0).length;

    return {
      total: products.length,
      validityAlerts,
      missingItems,
    };
  }, [products]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();

    let list = products.filter((item) => {
      const matchesSearch =
        term.length === 0 ||
        item.name.toLowerCase().includes(term) ||
        item.unit.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term);

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

  async function handleDeleteProduct(productId: string) {
    const removed = products.find((p) => p.id === productId);
    if (!removed) return;

    try {
      await inventoryService.deleteInventory(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showToast(
        "Item removido",
        `${removed.name} foi excluído do estoque.`,
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao remover item.";
      showToast("Erro", message, "error");
      throw error;
    }
  }

  async function handleEditProduct(productId: string, payload: EditStockItemPayload) {
    try {
      await inventoryService.patchInventory(productId, {
        name: payload.name.trim(),
        category: payload.category,
        unit: payload.unit,
      });

      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== productId) return p;
          return applyQuantityAndStatus(
            {
              ...p,
              name: payload.name.trim(),
              category: payload.category,
              unit: payload.unit,
            },
            p.quantity,
          );
        }),
      );

      showToast(
        "Alterações salvas",
        `${payload.name.trim()} foi atualizado.`,
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao atualizar item.";
      showToast("Erro", message, "error");
    }
  }

  function openEditModal(row: StockProductRow) {
    setEditingProduct(row);
    setEditOpen(true);
  }

  return (
    <PageContainer>
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
        onSuccess={() => void loadProducts()}
      />

      <EditStockItemModal
        isOpen={editOpen}
        product={editingProduct}
        onClose={() => {
          setEditOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <InventoryStatCard
          icon="Package"
          label="Total de Itens"
          value={summary.total}
          accent="blue"
          isLoading={loading}
        />
        <InventoryStatCard
          icon="XCircle"
          label="Alertas Validade"
          value={summary.validityAlerts}
          accent="red"
          isLoading={loading}
        />
        <InventoryStatCard
          icon="AlertTriangle"
          label="Itens em Falta"
          value={summary.missingItems}
          accent="red"
          isLoading={loading}
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

      {loading ? (
        <div
          className="mt-6 flex min-h-[280px] items-center justify-center rounded-lg border border-neutral-200 bg-white"
          role="status"
          aria-label="Carregando estoque"
        >
          <Icon
            name="Loader2"
            className="size-10 animate-spin text-primary"
            strokeWidth={2}
            aria-hidden
          />
        </div>
      ) : (
        <StockTable
          className="mt-6"
          rows={filteredRows}
          onEdit={openEditModal}
        />
      )}
    </PageContainer>
  );
}
