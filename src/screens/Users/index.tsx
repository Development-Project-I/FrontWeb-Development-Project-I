import { useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { UserCard } from "../../components/Cards/UserCard";
import { UserFilters } from "../../components/Cards/UserFilters";
import { UsersTable } from "../../components/Cards/UsersTable";
import {
  CreateUserModal,
  type AccessType,
} from "../../components/Modals/CreateUserModal";
import { useToast } from "../../contexts/ToastContext";
import { addUser, getUserRows, getUserSummaryItems, isEmailTaken } from "../../data/users";
import { Text } from "../../components/Text";

function parseLastAccess(value: string): number {
  const [datePart, timePart] = value.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hours, minutes] = (timePart ?? "00:00").split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes).getTime();
}

export function Users() {
  const { showToast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [usersRevision, setUsersRevision] = useState(0);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const rows = useMemo(() => getUserRows(), [usersRevision]);
  const summaryItems = useMemo(() => getUserSummaryItems(), [usersRevision]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();

    let list = rows.filter((user) => {
      const matchesSearch =
        term.length === 0 ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term);

      const matchesRole = role === "all" || user.role === role;

      return matchesSearch && matchesRole;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "email") {
        return a.email.localeCompare(b.email, "pt-BR");
      }
      if (sortBy === "role") {
        return a.role.localeCompare(b.role, "pt-BR");
      }
      if (sortBy === "lastAccess") {
        return parseLastAccess(b.lastAccess) - parseLastAccess(a.lastAccess);
      }
      return a.name.localeCompare(b.name, "pt-BR");
    });

    return list;
  }, [rows, search, role, sortBy]);

  function handleAddUser(payload: {
    firstName: string;
    lastName: string;
    email: string;
    accessType: AccessType;
  }) {
    if (isEmailTaken(payload.email)) {
      showToast(
        "E-mail já cadastrado",
        "Já existe um usuário com este e-mail na lista.",
        "warning",
      );
      return;
    }

    const created = addUser(payload);
    setUsersRevision((n) => n + 1);
    showToast(
      "Usuário adicionado",
      `${created.name} foi incluído na lista de usuários.`,
      "success",
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Text preset="headline_32/40" fontWeight="bold" color="black">
            Gerenciamento de Usuários
          </Text>
          <Text preset="body_16/24" color="#4d5868" className="mt-2">
            Controle de acesso e permissões do sistema
          </Text>
        </div>
        <Button
          title="Adicionar Usuário"
          icon="Plus"
          color="bg-primary text-white hover:brightness-110 active:brightness-95"
          className="shrink-0"
          onClick={() => setCreateOpen(true)}
        />
      </div>

      <CreateUserModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onAdd={handleAddUser}
      />

      <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryItems.map((item) => (
          <UserCard
            key={item.id}
            icon={item.icon}
            label={item.text}
            value={item.value}
            accent={item.accent}
          />
        ))}
      </div>

      <UserFilters
        className="mt-8"
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      <UsersTable className="mt-6" rows={filteredRows} />
    </div>
  );
}
