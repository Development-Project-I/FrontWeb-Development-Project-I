import clsx from "clsx";
import { Icon } from "../../Icon";
import {
  LessonIngredientItem,
  type LessonIngredient,
} from "../LessonIngredientItem";

export interface NextLessonData {
  title: string;
  timeRange: string;
  location: string;
  instructor: string;
}

export interface NextLessonCardProps {
  lesson?: NextLessonData;
  ingredients?: LessonIngredient[];
  className?: string;
}

const defaultLesson: NextLessonData = {
  title: "Confeitaria Básica",
  timeRange: "08:00 - 10:00",
  location: "Cozinha A",
  instructor: "Chef Patrícia Lima",
};

const defaultIngredients: LessonIngredient[] = [
  {
    id: "1",
    name: "Farinha de Trigo (kg)",
    required: 5,
    available: 150,
    status: "OK",
  },
  {
    id: "2",
    name: "Ovos (dúzia)",
    required: 12,
    available: 48,
    status: "OK",
  },
  {
    id: "3",
    name: "Manteiga (kg)",
    required: 2,
    available: 0,
    status: "Esgotado",
  },
  {
    id: "4",
    name: "Açúcar (kg)",
    required: 3,
    available: 200,
    status: "OK",
  },
  {
    id: "5",
    name: "Chocolate 70% (kg)",
    required: 1.5,
    available: 8,
    status: "OK",
  },
];

export function NextLessonCard({
  lesson = defaultLesson,
  ingredients = defaultIngredients,
  className,
}: NextLessonCardProps) {
  return (
    <section
      className={clsx(
        "rounded-2xl border border-red-100 bg-red-50 p-6 shadow-sm",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="preset-headline_20/25 font-bold text-neutral-900">
            {lesson.title}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="preset-body_14/20 inline-flex items-center gap-2 text-neutral-700">
              <Icon
                name="Clock"
                className="size-4 shrink-0 text-neutral-500"
                strokeWidth={2}
                aria-hidden
              />
              {lesson.timeRange}
            </span>
            <span className="preset-body_14/20 inline-flex items-center gap-2 text-neutral-700">
              <Icon
                name="MapPin"
                className="size-4 shrink-0 text-neutral-500"
                strokeWidth={2}
                aria-hidden
              />
              {lesson.location}
            </span>
          </div>
          <p className="preset-body_14/20 mt-2 text-neutral-700">{lesson.instructor}</p>
        </div>
        <span className="preset-tag_12/16 shrink-0 self-start rounded-full bg-blue-100 px-3 py-1.5 font-semibold text-blue-800">
          Próxima Aula
        </span>
      </div>

      <div className="mt-6 border-t border-red-100 pt-6">
        <div className="flex items-center gap-2">
          <Icon
            name="Package"
            className="size-5 shrink-0 text-neutral-600"
            strokeWidth={2}
            aria-hidden
          />
          <h3 className="preset-body_16/24 font-semibold text-neutral-900">
            Ingredientes Necessários
          </h3>
        </div>
        <ul className="mt-4 flex flex-col gap-3">
          {ingredients.map((item) => (
            <li key={item.id}>
              <LessonIngredientItem ingredient={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
