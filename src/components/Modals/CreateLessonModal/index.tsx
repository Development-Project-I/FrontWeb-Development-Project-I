import clsx from "clsx";
import type { FormEvent } from "react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { KITCHENS, type Kitchen } from "../../../constants/kitchens";
import {
  isLessonSlotTaken,
  LESSON_TIME_SLOTS,
  LESSON_WEEK_DAYS,
  type LessonTimeSlot,
  type WeekDayKey,
} from "../../../data/lessons";
import type { Teacher } from "../../Cards/TeacherCard";
import { Button } from "../../Button";
import { Icon } from "../../Icon";

export interface CreateLessonPayload {
  title: string;
  instructorId: string;
  instructor: string;
  location: Kitchen;
  day: WeekDayKey;
  startTime: LessonTimeSlot;
}

export interface CreateLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
  existingLessons?: { day: WeekDayKey; startTime: string }[];
  onCreate?: (payload: CreateLessonPayload) => void | Promise<void>;
}

const selectClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none ring-primary/30 focus:border-primary focus:ring-2";

const inputClass =
  "w-full rounded-lg border border-neutral-200 py-2.5 text-sm text-neutral-900 outline-none ring-primary/30 placeholder:text-neutral-400 focus:border-primary focus:ring-2";

export function CreateLessonModal({
  isOpen,
  onClose,
  teachers,
  existingLessons = [],
  onCreate,
}: CreateLessonModalProps) {
  const baseId = useId();
  const [title, setTitle] = useState("");
  const [kitchen, setKitchen] = useState<Kitchen>(KITCHENS[0]);
  const [day, setDay] = useState<WeekDayKey>("segunda");
  const [startTime, setStartTime] = useState<LessonTimeSlot>("08:00");
  const [instructorId, setInstructorId] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const useTeacherSelect = teachers.length > 0;

  const selectedTeacher = useMemo(() => {
    if (useTeacherSelect) {
      return teachers.find(
        (teacher) => String(teacher.id) === String(instructorId),
      );
    }

    const term = instructorName.trim().toLowerCase();
    if (!term) return undefined;
    return teachers.find((teacher) => teacher.name.toLowerCase() === term);
  }, [teachers, instructorId, instructorName, useTeacherSelect]);

  const slotTaken = useMemo(
    () => isLessonSlotTaken(existingLessons, day, startTime),
    [existingLessons, day, startTime],
  );

  const reset = useCallback(() => {
    setTitle("");
    setKitchen(KITCHENS[0]);
    setDay("segunda");
    setStartTime("08:00");
    setInstructorId("");
    setInstructorName("");
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

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const teacher = useTeacherSelect
      ? teachers.find((item) => String(item.id) === String(instructorId))
      : selectedTeacher;
    const trimmedInstructor = teacher?.name ?? instructorName.trim();

    if (!title.trim() || !trimmedInstructor || slotTaken) return;

    setIsSubmitting(true);
    try {
      await onCreate?.({
        title: title.trim(),
        instructorId: teacher ? String(teacher.id) : trimmedInstructor,
        instructor: trimmedInstructor,
        location: kitchen,
        day,
        startTime,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasInstructor = useTeacherSelect
    ? Boolean(instructorId)
    : Boolean(instructorName.trim());

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
                  name="CalendarPlus"
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
                  Criar Aula
                </h2>
                <p
                  id={`${baseId}-desc`}
                  className="preset-body_14/20 mt-1 font-regular text-neutral-500"
                >
                  Preencha os dados da nova aula
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
            <div>
              <label
                htmlFor={`${baseId}-title`}
                className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
              >
                Nome da aula <span className="text-primary">*</span>
              </label>
              <input
                id={`${baseId}-title`}
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex.: Confeitaria Avançada"
                className={clsx(inputClass, "px-3")}
              />
            </div>

            <div>
              <label
                htmlFor={`${baseId}-teacher`}
                className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
              >
                Professor <span className="text-primary">*</span>
              </label>
              {useTeacherSelect ? (
                <select
                  id={`${baseId}-teacher`}
                  required
                  value={instructorId}
                  onChange={(e) => setInstructorId(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Selecione um professor</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <input
                    id={`${baseId}-teacher`}
                    type="text"
                    required
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                    placeholder="Ex.: Chef Pedro Silva"
                    className={clsx(inputClass, "px-3")}
                    autoComplete="off"
                  />
                  <p className="preset-body_12/16 mt-1.5 text-neutral-500">
                    Nenhum professor cadastrado. Digite o nome manualmente.
                  </p>
                </>
              )}
            </div>

            <div>
              <label
                htmlFor={`${baseId}-kitchen`}
                className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
              >
                Cozinha <span className="text-primary">*</span>
              </label>
              <select
                id={`${baseId}-kitchen`}
                required
                value={kitchen}
                onChange={(e) => setKitchen(e.target.value as Kitchen)}
                className={selectClass}
              >
                {KITCHENS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${baseId}-day`}
                  className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
                >
                  Data da aula <span className="text-primary">*</span>
                </label>
                <select
                  id={`${baseId}-day`}
                  required
                  value={day}
                  onChange={(e) => setDay(e.target.value as WeekDayKey)}
                  className={selectClass}
                >
                  {LESSON_WEEK_DAYS.map(({ key, label }) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-time`}
                  className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
                >
                  Horário <span className="text-primary">*</span>
                </label>
                <select
                  id={`${baseId}-time`}
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value as LessonTimeSlot)}
                  className={selectClass}
                >
                  {LESSON_TIME_SLOTS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {slotTaken ? (
              <p className="preset-body_12/16 text-amber-700">
                Este horário já possui uma aula no calendário semanal. Escolha outro
                dia ou horário.
              </p>
            ) : null}
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
              title={isSubmitting ? "Criando..." : "Criar Aula"}
              icon="Plus"
              color="bg-primary text-white hover:brightness-110 active:brightness-95"
              className="w-full sm:w-auto"
              disabled={
                !title.trim() || !hasInstructor || slotTaken || isSubmitting
              }
            />
          </footer>
        </form>
      </div>
    </div>
  );
}
