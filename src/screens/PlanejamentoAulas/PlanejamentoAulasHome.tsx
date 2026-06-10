import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { NextLessonCard } from "../../components/Cards/NextLessonCard";
import { WeeklyCalendar } from "../../components/Cards/WeeklyCalendar";
import { CreateLessonModal } from "../../components/Modals/CreateLessonModal";
import { useToast } from "../../contexts/ToastContext";
import {
  findNextScheduledLesson,
  type LessonDetail,
} from "../../data/lessons";
import { fetchTeachers } from "../../data/teachers";
import { fetchInventoryItems } from "../../data/stock";
import { aulasService } from "../../services/aulas.service";
import { usersService } from "../../services/users.service";
import {
  mapApiAulaToLessonDetail,
  mapIngredientToNextLessonCard,
  weekDayToApi,
} from "../../utils/apiMappers";
import type { Teacher } from "../../components/Cards/TeacherCard";
import { Icon } from "../../components/Icon";
import { Text } from "../../components/Text";

export function PlanejamentoAulasHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [createLessonOpen, setCreateLessonOpen] = useState(false);
  const [lessons, setLessons] = useState<LessonDetail[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLessons = useCallback(async () => {
    setLoading(true);
    try {
      const [aulasRes, inventory, usersRes] = await Promise.all([
        aulasService.getAulas(),
        fetchInventoryItems(),
        usersService.getUsers(),
      ]);

      const professorNames = new Map(
        usersRes.data.map((user) => [
          user.id,
          [user.name, user.sobrenome].filter(Boolean).join(" ").trim(),
        ]),
      );

      setLessons(
        aulasRes.data.map((aula) =>
          mapApiAulaToLessonDetail(
            aula,
            inventory,
            professorNames.get(aula.professorId),
          ),
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao carregar aulas.";
      showToast("Erro", message, "error");
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const loadTeachers = useCallback(async () => {
    try {
      const data = await fetchTeachers();
      setTeachers(data);
    } catch {
      setTeachers([]);
    }
  }, []);

  useEffect(() => {
    void loadLessons();
    void loadTeachers();
  }, [loadLessons, loadTeachers, location.pathname, location.key]);

  const nextLesson = useMemo(
    () => findNextScheduledLesson(lessons),
    [lessons],
  );

  const nextLessonIngredients = useMemo(
    () => (nextLesson ? nextLesson.ingredients.map(mapIngredientToNextLessonCard) : []),
    [nextLesson],
  );

  async function handleCreateLesson(payload: {
    title: string;
    instructorId: string;
    instructor: string;
    location: string;
    day: import("../../data/lessons").WeekDayKey;
    startTime: string;
  }) {
    try {
      await aulasService.postAula({
        name: payload.title,
        professorId: payload.instructorId,
        kitchen: payload.location,
        dayOfWeek: weekDayToApi(payload.day),
        time: payload.startTime,
      });

      await loadLessons();
      showToast(
        "Aula criada",
        `${payload.title} foi adicionada ao calendário.`,
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao criar aula.";
      showToast("Erro", message, "error");
    }
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <Text preset="headline_32/40" fontWeight="bold" color="black">
          Planejamento de Aulas
        </Text>
        <Button
          title="Criar Aula"
          icon="Plus"
          color="bg-primary text-white hover:brightness-110 active:brightness-95"
          className="shrink-0"
          onClick={() => setCreateLessonOpen(true)}
        />
      </div>

      {loading || nextLesson ? (
        <NextLessonCard
          className="mt-8"
          isLoading={loading}
          stockAccent={nextLesson?.accent ?? "blue"}
          lesson={
            nextLesson
              ? {
                  title: nextLesson.title,
                  timeRange: nextLesson.timeRange,
                  location: nextLesson.location,
                  instructor: nextLesson.instructor,
                }
              : undefined
          }
          ingredients={nextLessonIngredients}
        />
      ) : null}

      {loading ? (
        <div
          className="mt-8 flex min-h-[420px] items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm"
          role="status"
          aria-label="Carregando calendário"
        >
          <Icon
            name="Loader2"
            className="size-10 animate-spin text-primary"
            strokeWidth={2}
            aria-hidden
          />
        </div>
      ) : (
        <WeeklyCalendar
          className="mt-8"
          lessons={lessons}
          onLessonClick={(lesson) =>
            navigate(`/planejamento-aulas/aula/${lesson.id}`)
          }
        />
      )}

      <CreateLessonModal
        isOpen={createLessonOpen}
        onClose={() => setCreateLessonOpen(false)}
        teachers={teachers}
        existingLessons={lessons}
        onCreate={handleCreateLesson}
      />
    </div>
  );
}
