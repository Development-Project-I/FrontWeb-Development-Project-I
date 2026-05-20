import clsx from "clsx";
import { Icon } from "../../Icon";

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
}

export interface TeacherCardProps {
  teacher: Teacher;
  className?: string;
}

export function TeacherCard({ teacher, className }: TeacherCardProps) {
  return (
    <article
      className={clsx(
        "rounded-xl border border-neutral-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      <header className="flex items-center gap-3">
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600"
          aria-hidden
        >
          <Icon name="Users" className="size-6" strokeWidth={2} />
        </span>
        <h2 className="preset-body_16/24 font-bold text-neutral-900">{teacher.name}</h2>
      </header>

      <ul className="mt-5 flex flex-col gap-3">
        <li className="flex items-start gap-2.5">
          <Icon
            name="Mail"
            className="mt-0.5 size-4 shrink-0 text-neutral-400"
            strokeWidth={2}
            aria-hidden
          />
          <span className="preset-body_14/20 text-neutral-600">{teacher.email}</span>
        </li>
        <li className="flex items-start gap-2.5">
          <Icon
            name="Phone"
            className="mt-0.5 size-4 shrink-0 text-neutral-400"
            strokeWidth={2}
            aria-hidden
          />
          <span className="preset-body_14/20 text-neutral-600">{teacher.phone}</span>
        </li>
        <li className="flex items-start gap-2.5">
          <Icon
            name="BookOpen"
            className="mt-0.5 size-4 shrink-0 text-neutral-400"
            strokeWidth={2}
            aria-hidden
          />
          <ul className="flex flex-col gap-0.5">
            {teacher.specialties.map((specialty) => (
              <li
                key={specialty}
                className="preset-body_14/20 text-neutral-600"
              >
                {specialty}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </article>
  );
}
