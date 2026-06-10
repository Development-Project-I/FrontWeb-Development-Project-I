import { useEffect, useState } from "react";
import { TeacherCard } from "../../components/Cards/TeacherCard";
import type { Teacher } from "../../components/Cards/TeacherCard";
import { Text } from "../../components/Text";
import { fetchTeachers } from "../../data/teachers";
import { useToast } from "../../contexts/ToastContext";

export function Professores() {
  const { showToast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchTeachers();
        setTeachers(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erro ao carregar professores.";
        showToast("Erro", message, "error");
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col p-8">
      <Text preset="headline_32/40" fontWeight="bold" color="black">
        Professores
      </Text>

      {loading ? (
        <p className="preset-body_14/20 mt-8 text-neutral-500">
          Carregando professores...
        </p>
      ) : teachers.length === 0 ? (
        <p className="preset-body_14/20 mt-8 text-neutral-500">
          Nenhum professor cadastrado. Adicione usuários com perfil Professor.
        </p>
      ) : (
        <ul className="mt-8 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {teachers.map((teacher) => (
            <li key={teacher.id}>
              <TeacherCard teacher={teacher} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
