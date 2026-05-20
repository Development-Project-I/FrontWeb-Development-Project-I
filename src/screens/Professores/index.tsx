import { TeacherCard } from "../../components/Cards/TeacherCard";
import { Text } from "../../components/Text";
import { getTeachers } from "../../data/teachers";

export function Professores() {
  const teachers = getTeachers();

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col p-8">
      <Text preset="headline_32/40" fontWeight="bold" color="black">
        Professores
      </Text>

      <ul className="mt-8 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {teachers.map((teacher) => (
          <li key={teacher.id}>
            <TeacherCard teacher={teacher} />
          </li>
        ))}
      </ul>
    </div>
  );
}
