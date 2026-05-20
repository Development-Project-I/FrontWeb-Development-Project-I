import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { NextLessonCard } from "../../components/Cards/NextLessonCard";
import { WeeklyCalendar } from "../../components/Cards/WeeklyCalendar";
import { CreateLessonModal } from "../../components/Modals/CreateLessonModal";
import { useToast } from "../../contexts/ToastContext";
import {
  addScheduledLesson,
  getAllLessons,
  type WeekDayKey,
} from "../../data/lessons";
import { getTeachers } from "../../data/teachers";
import { Text } from "../../components/Text";

export function PlanejamentoAulasHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [createLessonOpen, setCreateLessonOpen] = useState(false);
  const [lessonsRevision, setLessonsRevision] = useState(0);

  const lessons = useMemo(() => getAllLessons(), [lessonsRevision]);

  useEffect(() => {
    if (location.pathname === "/planejamento-aulas") {
      setLessonsRevision((n) => n + 1);
    }
  }, [location.pathname, location.key]);
  const teachers = useMemo(() => getTeachers(), []);

  function handleCreateLesson(payload: {
    title: string;
    instructor: string;
    location: string;
    day: WeekDayKey;
    startTime: string;
  }) {
    const created = addScheduledLesson(payload);
    if (!created) {
      showToast(
        "Horário indisponível",
        "Já existe uma aula neste dia e horário no calendário.",
        "warning",
      );
      return;
    }
    setLessonsRevision((n) => n + 1);
    showToast("Aula criada", `${payload.title} foi adicionada ao calendário.`, "success");
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

      <NextLessonCard className="mt-8" />

      <WeeklyCalendar
        className="mt-8"
        lessons={lessons}
        onLessonClick={(lesson) => navigate(`/planejamento-aulas/aula/${lesson.id}`)}
      />

      <CreateLessonModal
        isOpen={createLessonOpen}
        onClose={() => setCreateLessonOpen(false)}
        teachers={teachers}
        onCreate={handleCreateLesson}
      />
    </div>
  );
}
