import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { StockUnit } from "../../constants/inventory";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/Button";
import { LessonInfoCard } from "../../components/Cards/LessonInfoCard";
import {
  LessonIngredientDetailCard,
  LessonIngredientDetailCardSkeleton,
} from "../../components/Cards/LessonIngredientDetailCard";
import { AddLessonIngredientModal } from "../../components/Modals/AddLessonIngredientModal";
import type { LessonDetail } from "../../data/lessons";
import { fetchStockCatalog } from "../../data/stock";
import type { StockCatalogItem } from "../../data/stock.types";
import { aulasService } from "../../services/aulas.service";
import { usersService } from "../../services/users.service";
import { useToast } from "../../contexts/ToastContext";
import { fetchInventoryItems } from "../../data/stock";
import {
  aulaNeedsInventoryFallback,
  mapApiAulaToLessonDetail,
} from "../../utils/apiMappers";
import { ConfirmDropdown } from "../../components/ConfirmDropdown";
import { Icon } from "../../components/Icon";
import { Text } from "../../components/Text";

export function LessonDetails() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [stockCatalog, setStockCatalog] = useState<StockCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [removingIngredientId, setRemovingIngredientId] = useState<string | null>(
    null,
  );
  const [addIngredientOpen, setAddIngredientOpen] = useState(false);
  const [isRefreshingIngredients, setIsRefreshingIngredients] = useState(false);
  const deletedRef = useRef(false);
  const showToastRef = useRef(showToast);
  showToastRef.current = showToast;

  const loadLesson = useCallback(async () => {
    if (!lessonId || deletedRef.current) return;

    try {
      const aulaRes = await aulasService.getAulaById(lessonId);

      if (deletedRef.current) return;

      const [inventory, usersRes] = await Promise.all([
        aulaNeedsInventoryFallback([aulaRes.data])
          ? fetchInventoryItems()
          : Promise.resolve([]),
        usersService.getUsers(),
      ]);

      if (deletedRef.current) return;

      const professor = usersRes.data.find(
        (user) => String(user.id) === String(aulaRes.data.professorId),
      );
      const professorName = professor
        ? [professor.name, professor.sobrenome].filter(Boolean).join(" ").trim()
        : undefined;

      setLesson(
        mapApiAulaToLessonDetail(aulaRes.data, inventory, professorName),
      );
    } catch (error) {
      if (deletedRef.current) return;

      const message =
        error instanceof Error ? error.message : "Erro ao carregar aula.";
      showToastRef.current("Erro", message, "error");
      setLesson(null);
    } finally {
      if (!deletedRef.current) {
        setLoading(false);
      }
    }
  }, [lessonId]);

  const loadStock = useCallback(async () => {
    try {
      const catalog = await fetchStockCatalog();
      setStockCatalog(catalog);
    } catch {
      setStockCatalog([]);
    }
  }, []);

  useEffect(() => {
    void loadLesson();
    void loadStock();
  }, [loadLesson, loadStock]);

  const ingredients = lesson?.ingredients ?? [];

  const excludedStockIds = useMemo(
    () =>
      ingredients
        .map((item) => item.stockId)
        .filter((id): id is string => Boolean(id)),
    [ingredients],
  );

  if (loading) {
    return (
      <div className="p-8">
        <p className="preset-body_14/20 text-neutral-500">Carregando aula...</p>
      </div>
    );
  }

  if (!lesson) {
    return <Navigate to="/planejamento-aulas" replace />;
  }

  async function handleRemoveIngredient(ingredientId: string) {
    const removed = ingredients.find((item) => item.id === ingredientId);
    if (!removed) return;

    const confirmed = window.confirm(
      `Deseja remover "${removed.name}" desta aula?`,
    );
    if (!confirmed) return;

    setRemovingIngredientId(ingredientId);
    try {
      await aulasService.deleteIngredient(ingredientId);
      await loadLesson();
      showToast(
        "Ingrediente removido",
        `${removed.name} foi removido da aula.`,
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao remover ingrediente.";
      showToast("Erro", message, "error");
    } finally {
      setRemovingIngredientId(null);
    }
  }

  async function handleDeleteLesson() {
    if (!lessonId || !lesson) return;

    setIsDeleting(true);
    try {
      await aulasService.deleteAula(lessonId);
      deletedRef.current = true;
      setDeleteConfirmOpen(false);
      navigate("/planejamento-aulas", { replace: true });
      showToast(
        "Aula excluída",
        `${lesson.titleFull} foi removida do calendário.`,
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao excluir aula.";
      showToast("Erro", message, "error");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleAddIngredient(payload: {
    stockId: string;
    required: number;
    requiredUnit: StockUnit;
  }) {
    if (!lessonId) return;

    if (excludedStockIds.includes(payload.stockId)) {
      const stock = stockCatalog.find((item) => item.id === payload.stockId);
      showToast(
        "Ingrediente já adicionado",
        `${stock?.name ?? "Item"} já está na lista desta aula.`,
        "warning",
      );
      return;
    }

    setIsRefreshingIngredients(true);
    try {
      await aulasService.addAulaIngredient(lessonId, {
        itemId: Number(payload.stockId),
        quantity: payload.required,
        unit: payload.requiredUnit,
      });

      await loadLesson();
      const stock = stockCatalog.find((item) => item.id === payload.stockId);
      showToast(
        "Ingrediente adicionado",
        `${stock?.name ?? "Item"} foi incluído na aula.`,
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao adicionar ingrediente.";
      showToast("Erro", message, "error");
    } finally {
      setIsRefreshingIngredients(false);
    }
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/planejamento-aulas")}
            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Voltar para Planejamento de Aulas"
          >
            <Icon name="ArrowLeft" className="size-5" strokeWidth={2} aria-hidden />
          </button>
          <Text preset="headline_32/40" fontWeight="bold" color="black">
            Detalhes da Aula
          </Text>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-auto">
            <Button
              title={isDeleting ? "Excluindo..." : "Excluir Aula"}
              icon="Trash2"
              color="border border-red-200 bg-white text-red-600 hover:bg-red-50 active:bg-red-100"
              className="w-full sm:w-auto"
              disabled={isDeleting}
              onClick={() => setDeleteConfirmOpen(true)}
            />
            <ConfirmDropdown
              isOpen={deleteConfirmOpen}
              onClose={() => setDeleteConfirmOpen(false)}
              onConfirm={() => void handleDeleteLesson()}
              message="Deseja mesmo cancelar aula?"
              isLoading={isDeleting}
            />
          </div>
          <Button
            title="Adicionar Ingrediente"
            icon="Plus"
            color="bg-primary text-white hover:brightness-110 active:brightness-95"
            className="w-full sm:w-auto"
            disabled={isDeleting || isRefreshingIngredients}
            onClick={() => setAddIngredientOpen(true)}
          />
        </div>
      </div>

      <div className="mt-8">
        <h1 className="preset-headline_24/32 font-bold text-neutral-900">
          {lesson.titleFull}
        </h1>
        <p className="preset-body_16/24 mt-1 text-neutral-500">{lesson.dayLabel}</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <LessonInfoCard icon="Clock" label="Horário" value={lesson.timeRange} />
        <LessonInfoCard icon="User" label="Professor" value={lesson.instructor} />
        <LessonInfoCard icon="MapPin" label="Sala" value={lesson.location} />
      </div>

      <section className="mt-8">
        <div className="flex items-center gap-2">
          <Icon
            name="Package"
            className="size-5 shrink-0 text-neutral-600"
            strokeWidth={2}
            aria-hidden
          />
          <h2 className="preset-headline_18/24 font-bold text-neutral-900">
            Ingredientes Necessários
          </h2>
        </div>

        <ul
          className="mt-4 flex flex-col gap-4"
          aria-busy={isRefreshingIngredients}
        >
          {isRefreshingIngredients ? (
            <>
              {ingredients.map((ingredient) => (
                <li key={ingredient.id}>
                  <LessonIngredientDetailCard
                    ingredient={ingredient}
                    onRemove={handleRemoveIngredient}
                    isRemoving={removingIngredientId === ingredient.id}
                    isLoading
                  />
                </li>
              ))}
              <li>
                <LessonIngredientDetailCardSkeleton />
              </li>
            </>
          ) : ingredients.length === 0 ? (
            <li className="preset-body_14/20 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-neutral-600 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
              Nenhum ingrediente adicionado a esta aula.
            </li>
          ) : (
            ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                <LessonIngredientDetailCard
                  ingredient={ingredient}
                  onRemove={handleRemoveIngredient}
                  isRemoving={removingIngredientId === ingredient.id}
                />
              </li>
            ))
          )}
        </ul>
      </section>

      <AddLessonIngredientModal
        isOpen={addIngredientOpen}
        onClose={() => setAddIngredientOpen(false)}
        stockItems={stockCatalog}
        excludedStockIds={excludedStockIds}
        onAdd={handleAddIngredient}
      />
    </div>
  );
}
