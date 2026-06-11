import { ApiUserRole } from "../constants/apiUserRole";
import type { Teacher } from "../components/Cards/TeacherCard";
import { usersService } from "../services/users.service";
import { mapApiUserToTeacher } from "../utils/apiMappers";

export async function fetchTeachers(): Promise<Teacher[]> {
  const { data } = await usersService.getUsers();
  return data
    .filter((user) => user.role === ApiUserRole.PROFESSOR)
    .map(mapApiUserToTeacher);
}
