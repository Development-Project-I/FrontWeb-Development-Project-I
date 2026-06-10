import type { UserRole, UserStatus } from "../constants/users";
import type { UserListRow } from "../components/Cards/UsersTable";
import type { AccessType } from "../components/Modals/CreateUserModal";
import type { UserCardAccent } from "../components/Cards/UserCard";

export interface UserSummaryItem {
  id: string;
  text: string;
  value: number;
  icon: string;
  accent: UserCardAccent;
}

const users: UserListRow[] = [
  {
    id: "1",
    name: "João Silva",
    firstName: "João",
    lastName: "Silva",
    email: "joao.silva@gastroplan.com",
    role: "Estoquista",
    status: "Ativo",
    lastAccess: "23/04/2026 14:30",
  },
  {
    id: "2",
    name: "Maria Santos",
    firstName: "Maria",
    lastName: "Santos",
    email: "maria.santos@gastroplan.com",
    role: "Professor",
    status: "Ativo",
    lastAccess: "22/04/2026 09:15",
  },
  {
    id: "3",
    name: "Carlos Admin",
    firstName: "Carlos",
    lastName: "Admin",
    email: "carlos.admin@gastroplan.com",
    role: "Administrador",
    status: "Ativo",
    lastAccess: "23/04/2026 08:00",
  },
  {
    id: "4",
    name: "Ana Estoque",
    firstName: "Ana",
    lastName: "Estoque",
    email: "ana.estoque@gastroplan.com",
    role: "Estoquista",
    status: "Inativo",
    lastAccess: "10/04/2026 11:20",
  },
  {
    id: "5",
    name: "Pedro Lima",
    firstName: "Pedro",
    lastName: "Lima",
    email: "pedro.lima@gastroplan.com",
    role: "Professor",
    status: "Ativo",
    lastAccess: "21/04/2026 16:45",
  },
  {
    id: "6",
    name: "Juliana Costa",
    firstName: "Juliana",
    lastName: "Costa",
    email: "juliana.costa@gastroplan.com",
    role: "Estoquista",
    status: "Ativo",
    lastAccess: "20/04/2026 10:00",
  },
];

let nextUserId = 7;

function accessTypeToRole(type: AccessType): UserRole {
  switch (type) {
    case "estoque":
      return "Estoquista";
    case "professor":
      return "Professor";
    case "admin":
      return "Administrador";
  }
}

function formatLastAccess(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function getUserRows(): UserListRow[] {
  return users;
}

export function getUserSummaryItems(): UserSummaryItem[] {
  const total = users.length;
  const admins = users.filter((u) => u.role === "Administrador").length;
  const professors = users.filter((u) => u.role === "Professor").length;
  const stockists = users.filter((u) => u.role === "Estoquista").length;

  return [
    {
      id: "total",
      text: "Total de Usuários",
      value: total,
      icon: "Users",
      accent: "blue",
    },
    {
      id: "admin",
      text: "Administradores",
      value: admins,
      icon: "Shield",
      accent: "purple",
    },
    {
      id: "professor",
      text: "Professores",
      value: professors,
      icon: "User",
      accent: "indigo",
    },
    {
      id: "stock",
      text: "Estoquistas",
      value: stockists,
      icon: "User",
      accent: "blue",
    },
  ];
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  accessType: AccessType;
}

export function addUser(input: CreateUserInput): UserListRow {
  const name = `${input.firstName} ${input.lastName}`.trim();
  const row: UserListRow = {
    id: String(nextUserId++),
    name,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    role: accessTypeToRole(input.accessType),
    status: "Ativo" satisfies UserStatus,
    lastAccess: formatLastAccess(new Date()),
  };
  users.push(row);
  return row;
}

export function isEmailTaken(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return users.some((u) => u.email.toLowerCase() === normalized);
}
