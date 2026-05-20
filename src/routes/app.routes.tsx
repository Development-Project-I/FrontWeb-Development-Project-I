import { Navigate, Route, Routes } from "react-router-dom";
import { Dashboard } from "../screens/Dashboard";
import { Estoque } from "../screens/Estoque";
import {
  LessonDetails,
  PlanejamentoAulasHome,
} from "../screens/PlanejamentoAulas";
import { Professores } from "../screens/Professores";
import { Configuracoes } from "../screens/Configuracoes";
import { Relatorios } from "../screens/Relatorios";
import { Users } from "../screens/Users";
import { Login } from "../screens/Login";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<></>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/estoque" element={<Estoque />} />
      <Route path="/planejamento-aulas" element={<PlanejamentoAulasHome />} />
      <Route path="/planejamento-aulas/aula/:lessonId" element={<LessonDetails />} />
      <Route path="/professores" element={<Professores />} />
      <Route path="/usuarios" element={<Users />} />
      <Route path="/relatorios" element={<Relatorios />} />
      <Route path="/configuracoes" element={<Configuracoes />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}