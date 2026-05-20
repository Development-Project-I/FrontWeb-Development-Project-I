import type {
  ClassSlotAccent,
  ClassSlotData,
} from "../components/Cards/WeeklyCalendar/ClassSlotCard";

export type WeekDayKey = "segunda" | "terca" | "quarta" | "quinta" | "sexta";

export interface ScheduledLesson extends ClassSlotData {
  day: WeekDayKey;
  startTime: string;
}

export type LessonIngredientStatus = "OK" | "Baixo" | "SemEstoque";

export interface LessonIngredientDetail {
  id: string;
  stockId?: string;
  name: string;
  category: string;
  required: number;
  requiredUnit: string;
  available: number;
  stockUnit: string;
  status: LessonIngredientStatus;
}

export interface LessonDetail extends ScheduledLesson {
  titleFull: string;
  dayLabel: string;
  timeRange: string;
  ingredients: LessonIngredientDetail[];
}

const dayLabels: Record<WeekDayKey, string> = {
  segunda: "Segunda",
  terca: "Terça",
  quarta: "Quarta",
  quinta: "Quinta",
  sexta: "Sexta",
};

export const LESSON_WEEK_DAYS: { key: WeekDayKey; label: string }[] = [
  { key: "segunda", label: dayLabels.segunda },
  { key: "terca", label: dayLabels.terca },
  { key: "quarta", label: dayLabels.quarta },
  { key: "quinta", label: dayLabels.quinta },
  { key: "sexta", label: dayLabels.sexta },
];

export const LESSON_TIME_SLOTS = [
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
] as const;

export type LessonTimeSlot = (typeof LESSON_TIME_SLOTS)[number];

export function isLessonSlotTaken(day: WeekDayKey, startTime: string): boolean {
  return scheduledLessons.some(
    (lesson) => lesson.day === day && lesson.startTime === startTime,
  );
}

function endTime(start: string): string {
  const [h] = start.split(":").map(Number);
  return `${String(h + 2).padStart(2, "0")}:00`;
}

export const scheduledLessons: ScheduledLesson[] = [
  {
    id: "1",
    title: "Confeitaria Básica",
    instructor: "Chef Patrícia Lima",
    location: "Cozinha A",
    day: "segunda",
    startTime: "08:00",
    accent: "red",
  },
  {
    id: "2",
    title: "Culinária Italiana",
    instructor: "Chef Marco Rossi",
    location: "Cozinha B",
    day: "segunda",
    startTime: "10:00",
    accent: "blue",
  },
  {
    id: "3",
    title: "Técnicas de Carnes",
    instructor: "Chef Roberto Mendes",
    location: "Cozinha C",
    day: "terca",
    startTime: "08:00",
    accent: "amber",
  },
  {
    id: "4",
    title: "Gastronomia Francesa",
    instructor: "Chef Marie Dubois",
    location: "Cozinha A",
    day: "terca",
    startTime: "14:00",
    accent: "red",
  },
  {
    id: "5",
    title: "Culinária Japonesa",
    instructor: "Chef Yuki Tanaka",
    location: "Cozinha D",
    day: "quarta",
    startTime: "08:00",
    accent: "red",
  },
  {
    id: "6",
    title: "Aves e Guarnições",
    instructor: "Chef Ana Paula Costa",
    location: "Cozinha B",
    day: "quinta",
    startTime: "10:00",
    accent: "blue",
  },
  {
    id: "7",
    title: "Panificação Artesanal",
    instructor: "Chef Fernando Silva",
    location: "Cozinha E",
    day: "sexta",
    startTime: "08:00",
    accent: "red",
  },
];

const ingredientsByLesson: Record<string, LessonIngredientDetail[]> = {
  "1": [
    { id: "i1", name: "Farinha de Trigo", category: "Farináceos", required: 5, requiredUnit: "kg", available: 150, stockUnit: "kg", status: "OK" },
    { id: "i2", name: "Ovos", category: "Laticínios", required: 12, requiredUnit: "dúzia", available: 48, stockUnit: "dúzia", status: "OK" },
    { id: "i3", name: "Manteiga", category: "Laticínios", required: 2, requiredUnit: "kg", available: 0, stockUnit: "kg", status: "SemEstoque" },
    { id: "i4", name: "Açúcar", category: "Farináceos", required: 3, requiredUnit: "kg", available: 200, stockUnit: "kg", status: "OK" },
  ],
  "3": [
    {
      id: "i1",
      stockId: "7",
      name: "Filé Mignon",
      category: "Carnes",
      required: 12,
      requiredUnit: "kg",
      available: 8,
      stockUnit: "kg",
      status: "Baixo",
    },
    {
      id: "i2",
      stockId: "4",
      name: "Batata",
      category: "Vegetais",
      required: 50,
      requiredUnit: "kg",
      available: 90,
      stockUnit: "kg",
      status: "OK",
    },
    {
      id: "i3",
      stockId: "5",
      name: "Cebola",
      category: "Vegetais",
      required: 30,
      requiredUnit: "kg",
      available: 120,
      stockUnit: "kg",
      status: "OK",
    },
    {
      id: "i4",
      stockId: "3",
      name: "Azeite Extra Virgem",
      category: "Óleos",
      required: 2,
      requiredUnit: "L",
      available: 45,
      stockUnit: "L",
      status: "OK",
    },
  ],
  "2": [
    { id: "i1", name: "Farinha de Trigo", category: "Farináceos", required: 8, requiredUnit: "kg", available: 150, stockUnit: "kg", status: "OK" },
    { id: "i2", name: "Ovos", category: "Laticínios", required: 6, requiredUnit: "dúzia", available: 48, stockUnit: "dúzia", status: "OK" },
    { id: "i3", name: "Azeite Extra Virgem", category: "Óleos", required: 3, requiredUnit: "L", available: 45, stockUnit: "L", status: "OK" },
  ],
};

const defaultIngredients: LessonIngredientDetail[] = [
  { id: "d1", name: "Sal", category: "Temperos", required: 1, requiredUnit: "kg", available: 80, stockUnit: "kg", status: "OK" },
  { id: "d2", name: "Azeite Extra Virgem", category: "Óleos", required: 2, requiredUnit: "L", available: 45, stockUnit: "L", status: "OK" },
  { id: "d3", name: "Alho", category: "Temperos", required: 2, requiredUnit: "kg", available: 15, stockUnit: "kg", status: "OK" },
];

export function getLessonIngredients(lessonId: string): LessonIngredientDetail[] {
  return ingredientsByLesson[lessonId] ?? defaultIngredients;
}

export function lessonHasNoIngredients(lessonId: string): boolean {
  const items = ingredientsByLesson[lessonId];
  return items !== undefined && items.length === 0;
}

export function setLessonIngredients(
  lessonId: string,
  ingredients: LessonIngredientDetail[],
): void {
  ingredientsByLesson[lessonId] = ingredients;
}

export function getLessonCalendarAccent(lessonId: string): ClassSlotAccent {
  const ingredients =
    lessonId in ingredientsByLesson
      ? ingredientsByLesson[lessonId]
      : getLessonIngredients(lessonId);

  if (ingredients.some((item) => item.status === "SemEstoque")) {
    return "red";
  }

  if (ingredients.some((item) => item.status === "Baixo")) {
    return "amber";
  }

  return "blue";
}

export function getLessonDetail(lessonId: string): LessonDetail | undefined {
  const lesson = scheduledLessons.find((l) => l.id === lessonId);
  if (!lesson) return undefined;

  return {
    ...lesson,
    titleFull: lesson.title,
    dayLabel: dayLabels[lesson.day],
    timeRange: `${lesson.startTime} - ${endTime(lesson.startTime)}`,
    ingredients: getLessonIngredients(lessonId),
    accent: getLessonCalendarAccent(lessonId),
  };
}

export function getAllLessons(): ScheduledLesson[] {
  return scheduledLessons.map((lesson) => ({
    ...lesson,
    accent: getLessonCalendarAccent(lesson.id),
  }));
}

let nextLessonId = 8;

export interface CreateScheduledLessonInput {
  title: string;
  instructor: string;
  location: string;
  day: WeekDayKey;
  startTime: string;
}

export function addScheduledLesson(
  input: CreateScheduledLessonInput,
): ScheduledLesson | null {
  if (isLessonSlotTaken(input.day, input.startTime)) {
    return null;
  }

  const id = String(nextLessonId++);
  const { day, startTime } = input;

  const lesson: ScheduledLesson = {
    id,
    title: input.title,
    instructor: input.instructor,
    location: input.location,
    day,
    startTime,
    accent: "blue",
  };

  scheduledLessons.push(lesson);
  ingredientsByLesson[id] = [];

  return {
    ...lesson,
    accent: getLessonCalendarAccent(id),
  };
}
