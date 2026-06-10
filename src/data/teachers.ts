import type { Teacher } from "../components/Cards/TeacherCard";
import { usersService } from "../services/users.service";
import { mapApiUserToTeacher } from "../utils/apiMappers";

export async function fetchTeachers(): Promise<Teacher[]> {
  const { data } = await usersService.getUsers();
  return data
    .filter((user) => user.role === "PROFESSOR")
    .map(mapApiUserToTeacher);
}

export async function getTeacherNameById(
  professorId: string,
): Promise<string | undefined> {
  try {
    const { data } = await usersService.getUserById(professorId);
    return [data.name, data.sobrenome].filter(Boolean).join(" ").trim();
  } catch {
    return undefined;
  }
}
