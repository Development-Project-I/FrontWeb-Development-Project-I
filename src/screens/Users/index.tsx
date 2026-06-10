import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { UserCard } from "../../components/Cards/UserCard";
import { UserFilters } from "../../components/Cards/UserFilters";
import { UsersTable } from "../../components/Cards/UsersTable";
import type { UserCardAccent } from "../../components/Cards/UserCard";
import {
  CreateUserModal,
  type AccessType,
} from "../../components/Modals/CreateUserModal";
import { EditUserModal } from "../../components/Modals/EditUserModal";
import { useToast } from "../../contexts/ToastContext";
import { usersService } from "../../services/users.service";
import { Icon } from "../../components/Icon";
import { Text } from "../../components/Text";
import {
  accessTypeToApiRole,
  mapApiUserToRow,
  userRoleToAccessType,
} from "../../utils/apiMappers";
import type { UserListRow } from "../../components/Cards/UsersTable";

function parseLastAccess(value: string): number {
  if (value === "—") return 0;
  const [datePart, timePart] = value.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hours, minutes] = (timePart ?? "00:00").split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes).getTime();
}

function buildSummary(rows: UserListRow[]) {
  const total = rows.length;
  const admins = rows.filter((u) => u.role === "Administrador").length;
  const professors = rows.filter((u) => u.role === "Professor").length;
  const stockists = rows.filter((u) => u.role === "Estoquista").length;

  return [
    { id: "total", text: "Total de Usuários", value: total, icon: "Users", accent: "blue" as UserCardAccent },
    { id: "admin", text: "Administradores", value: admins, icon: "Shield", accent: "purple" as UserCardAccent },
    { id: "professor", text: "Professores", value: professors, icon: "User", accent: "indigo" as UserCardAccent },
    { id: "stock", text: "Estoquistas", value: stockists, icon: "User", accent: "blue" as UserCardAccent },
  ];
}

export function Users() {
  const { showToast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserListRow | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [rows, setRows] = useState<UserListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await usersService.getUsers();
      setRows(data.map(mapApiUserToRow));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao carregar usuários.";
      showToast("Erro", message, "error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const summaryItems = useMemo(() => buildSummary(rows), [rows]);

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

  function handleEditUser(row: UserListRow) {
    setEditingUser(row);
    setEditOpen(true);
  }

  async function handleSaveUser(payload: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    accessType: AccessType;
  }) {
    if (!editingUser) return;

    const normalized = payload.email.trim().toLowerCase();
    const emailTaken = rows.some(
      (user) =>
        user.id !== editingUser.id &&
        user.email.toLowerCase() === normalized,
    );

    if (emailTaken) {
      showToast(
        "E-mail já cadastrado",
        "Já existe outro usuário com este e-mail.",
        "warning",
      );
      return;
    }

    try {
      const { data } = await usersService.patchUser(editingUser.id, {
        name: payload.firstName.trim(),
        sobrenome: payload.lastName.trim(),
        email: payload.email.trim(),
        role: accessTypeToApiRole(payload.accessType),
        ...(payload.password ? { password: payload.password } : {}),
      });

      setRows((prev) =>
        prev.map((user) =>
          user.id === editingUser.id ? mapApiUserToRow(data) : user,
        ),
      );
      showToast(
        "Usuário atualizado",
        `${data.name} foi atualizado com sucesso.`,
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao atualizar usuário.";
      showToast("Erro", message, "error");
    }
  }

  async function handleDeleteUser(row: UserListRow) {
    setDeletingUserId(row.id);
    try {
      await usersService.deleteUser(row.id);
      setRows((prev) => prev.filter((user) => user.id !== row.id));
      showToast(
        "Usuário removido",
        `${row.name} foi excluído do sistema.`,
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao remover usuário.";
      showToast("Erro", message, "error");
    } finally {
      setDeletingUserId(null);
    }
  }

  async function handleAddUser(payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    accessType: AccessType;
  }) {
    const normalized = payload.email.trim().toLowerCase();
    if (rows.some((u) => u.email.toLowerCase() === normalized)) {
      showToast(
        "E-mail já cadastrado",
        "Já existe um usuário com este e-mail na lista.",
        "warning",
      );
      return;
    }

    try {
      const { data } = await usersService.registerUser({
        name: payload.firstName.trim(),
        sobrenome: payload.lastName.trim(),
        email: payload.email.trim(),
        password: payload.password,
        role: accessTypeToApiRole(payload.accessType),
      });

      setRows((prev) => [...prev, mapApiUserToRow(data)]);
      showToast(
        "Usuário adicionado",
        `${data.name} foi incluído na lista de usuários.`,
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao cadastrar usuário.";
      showToast("Erro", message, "error");
    }
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

      <EditUserModal
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditingUser(null);
        }}
        initialData={
          editingUser
            ? {
                firstName: editingUser.firstName,
                lastName: editingUser.lastName,
                email: editingUser.email,
                accessType: userRoleToAccessType(editingUser.role),
              }
            : undefined
        }
        onSave={handleSaveUser}
      />

      <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryItems.map((item) => (
          <UserCard
            key={item.id}
            icon={item.icon}
            label={item.text}
            value={item.value}
            accent={item.accent}
            isLoading={loading}
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

      {loading ? (
        <div
          className="mt-6 flex min-h-[280px] items-center justify-center rounded-lg border border-neutral-200 bg-white"
          role="status"
          aria-label="Carregando usuários"
        >
          <Icon
            name="Loader2"
            className="size-10 animate-spin text-primary"
            strokeWidth={2}
            aria-hidden
          />
        </div>
      ) : (
        <UsersTable
          className="mt-6"
          rows={filteredRows}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          deletingUserId={deletingUserId}
        />
      )}
    </div>
  );
}
