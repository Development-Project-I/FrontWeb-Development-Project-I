import type { Teacher } from "../components/Cards/TeacherCard";

export const teachers: Teacher[] = [
  {
    id: "1",
    name: "Chef Patrícia Lima",
    email: "patricia.lima@gastroplan.com",
    phone: "(11) 98765-4321",
    specialties: ["Confeitaria Básica", "Técnicas de Sobremesas"],
  },
  {
    id: "2",
    name: "Chef Marco Rossi",
    email: "marco.rossi@gastroplan.com",
    phone: "(11) 98765-4322",
    specialties: ["Culinária Italiana", "Massas Artesanais"],
  },
  {
    id: "3",
    name: "Chef Roberto Mendes",
    email: "roberto.mendes@gastroplan.com",
    phone: "(11) 98765-4323",
    specialties: ["Técnicas de Carnes", "Churrasco Gourmet"],
  },
  {
    id: "4",
    name: "Chef Marie Dubois",
    email: "marie.dubois@gastroplan.com",
    phone: "(11) 98765-4324",
    specialties: ["Gastronomia Francesa", "Haute Cuisine"],
  },
  {
    id: "5",
    name: "Chef Yuki Tanaka",
    email: "yuki.tanaka@gastroplan.com",
    phone: "(11) 98765-4325",
    specialties: ["Culinária Japonesa", "Sushi & Sashimi"],
  },
  {
    id: "6",
    name: "Chef Ana Paula Costa",
    email: "ana.costa@gastroplan.com",
    phone: "(11) 98765-4326",
    specialties: ["Aves e Guarnições", "Cozinha Brasileira"],
  },
  {
    id: "7",
    name: "Chef Fernando Silva",
    email: "fernando.silva@gastroplan.com",
    phone: "(11) 98765-4327",
    specialties: ["Panificação Artesanal", "Fermentação Natural"],
  },
];

export function getTeachers(): Teacher[] {
  return teachers;
}

export function getTeacherById(id: string): Teacher | undefined {
  return teachers.find((teacher) => teacher.id === id);
}
