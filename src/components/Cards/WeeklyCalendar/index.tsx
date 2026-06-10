import clsx from "clsx";
import {
  LESSON_TIME_SLOTS,
  LESSON_WEEK_DAYS,
  type ScheduledLesson,
  type WeekDayKey,
} from "../../../data/lessons";
import { ClassSlotCard } from "./ClassSlotCard";

export type { ScheduledLesson, WeekDayKey };

export interface WeeklyCalendarProps {
  lessons?: ScheduledLesson[];
  onLessonClick?: (lesson: ScheduledLesson) => void;
  className?: string;
}

const dayColumns = LESSON_WEEK_DAYS;
const timeSlots = LESSON_TIME_SLOTS;

const ROW_HEIGHT = "h-[104px]";

const headerCellClass =
  "border border-neutral-200 px-3 py-3 text-sm font-medium text-neutral-500";

const timeCellClass = clsx(
  "border border-neutral-200 bg-white px-4 py-4 align-top text-sm text-neutral-500",
  ROW_HEIGHT,
);

const dayCellClass = clsx(
  "border border-neutral-200 bg-white align-top p-2",
  ROW_HEIGHT,
);

function lessonAt(
  lessons: ScheduledLesson[],
  day: WeekDayKey,
  time: string,
): ScheduledLesson | undefined {
  return lessons.find((l) => l.day === day && l.startTime === time);
}

export function WeeklyCalendar({
  lessons = [],
  onLessonClick,
  className,
}: WeeklyCalendarProps) {
  return (
    <section
      className={clsx(
        "overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm",
        className,
      )}
    >
      <h2 className="preset-headline_18/24 font-bold text-neutral-900">
        Calendário Semanal
      </h2>

      <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200">
        <table className="w-full min-w-[800px] border-collapse bg-white">
          <thead>
            <tr className="bg-neutral-50">
              <th
                scope="col"
                className={clsx(headerCellClass, "w-[88px] text-left")}
              >
                Horário
              </th>
              {dayColumns.map(({ label }) => (
                <th
                  key={label}
                  scope="col"
                  className={clsx(headerCellClass, "text-center")}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time}>
                <td className={timeCellClass}>{time}</td>
                {dayColumns.map(({ key }) => {
                  const slot = lessonAt(lessons, key, time);

                  return (
                    <td key={`${time}-${key}`} className={dayCellClass}>
                      {slot ? (
                        <ClassSlotCard
                          lesson={slot}
                          showNoIngredients={slot.hasNoIngredients}
                          className="w-full"
                          onClick={
                            onLessonClick
                              ? () => onLessonClick(slot)
                              : undefined
                          }
                        />
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
