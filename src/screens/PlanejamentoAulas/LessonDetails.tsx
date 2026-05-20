import { useEffect, useMemo, useState } from "react";
import type { StockUnit } from "../../constants/inventory";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/Button";
import { LessonInfoCard } from "../../components/Cards/LessonInfoCard";
import { LessonIngredientDetailCard } from "../../components/Cards/LessonIngredientDetailCard";
import { AddLessonIngredientModal } from "../../components/Modals/AddLessonIngredientModal";
import {
  getLessonDetail,
  setLessonIngredients,
  type LessonIngredientDetail,
} from "../../data/lessons";
import {
  buildLessonIngredientFromStock,
  getStockCatalog,
  getStockItemById,
} from "../../data/stock";
import { useToast } from "../../contexts/ToastContext";
import { Icon } from "../../components/Icon";
import { Text } from "../../components/Text";

export function LessonDetails() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const lesson = lessonId ? getLessonDetail(lessonId) : undefined;

  const [ingredients, setIngredients] = useState<LessonIngredientDetail[]>(() => {
    if (!lessonId) return [];
    return getLessonDetail(lessonId)?.ingredients ?? [];
  });
  const [addIngredientOpen, setAddIngredientOpen] = useState(false);

  const stockCatalog = useMemo(() => getStockCatalog(), []);

  useEffect(() => {
    if (!lessonId) {
      setIngredients([]);
      return;
    }
    setIngredients(getLessonDetail(lessonId)?.ingredients ?? []);
  }, [lessonId]);

  const excludedStockIds = useMemo(
    () =>
      ingredients
        .map((item) => item.stockId)
        .filter((id): id is string => Boolean(id)),
    [ingredients],
  );

  if (!lesson) {
    return <Navigate to="/planejamento-aulas" replace />;
  }

  function persistIngredients(next: LessonIngredientDetail[]) {
    setIngredients(next);
    if (lessonId) {
      setLessonIngredients(lessonId, next);
    }
  }

  function handleRemoveIngredient(ingredientId: string) {
    const removed = ingredients.find((item) => item.id === ingredientId);
    if (!removed) return;

    persistIngredients(ingredients.filter((item) => item.id !== ingredientId));
    showToast(
      "Ingrediente removido",
      `${removed.name} foi removido da aula.`,
      "success",
    );
  }

  function handleAddIngredient(payload: {
    stockId: string;
    required: number;
    requiredUnit: StockUnit;
  }) {
    const stock = getStockItemById(payload.stockId);
    if (!stock) return;

    if (excludedStockIds.includes(payload.stockId)) {
      showToast(
        "Ingrediente já adicionado",
        `${stock.name} já está na lista desta aula.`,
        "warning",
      );
      return;
    }

    const entry = buildLessonIngredientFromStock(
      stock,
      payload.required,
      payload.requiredUnit,
    );
    persistIngredients([...ingredients, entry]);
    showToast(
      "Ingrediente adicionado",
      `${entry.name} foi incluído na aula.`,
      "success",
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/planejamento-aulas")}
            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Voltar para Planejamento de Aulas"
          >
            <Icon name="ArrowLeft" className="size-5" strokeWidth={2} aria-hidden />
          </button>
          <Text preset="headline_32/40" fontWeight="bold" color="black">
            Detalhes da Aula
          </Text>
        </div>
        <Button
          title="Adicionar Ingrediente"
          icon="Plus"
          color="bg-primary text-white hover:brightness-110 active:brightness-95"
          className="shrink-0"
          onClick={() => setAddIngredientOpen(true)}
        />
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

        <ul className="mt-4 flex flex-col gap-4">
          {ingredients.map((ingredient) => (
            <li key={ingredient.id}>
              <LessonIngredientDetailCard
                ingredient={ingredient}
                onRemove={handleRemoveIngredient}
              />
            </li>
          ))}
        </ul>
      </section>

      <p className="preset-body_14/20 mt-6 flex items-center gap-2 text-neutral-500">
        <Icon
          name="Lightbulb"
          className="size-4 shrink-0 text-amber-500"
          strokeWidth={2}
          aria-hidden
        />
        Clique em um material para ver mais detalhes do estoque
      </p>

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
