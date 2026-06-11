import { DashboardQuickActions } from "../../components/Dashboard/DashboardQuickActions";
import { DashboardWelcome } from "../../components/Dashboard/DashboardWelcome";
import { PageContainer } from "../../components/Layout/PageContainer";
import { Text } from "../../components/Text";
import { ApiUserRole } from "../../constants/apiUserRole";
import { useAuth } from "../../contexts/AuthContext";

export function Dashboard() {
  const { user } = useAuth();
  const role = user?.role ?? ApiUserRole.ESTOQUISTA;

  return (
    <PageContainer className="gap-8">
      <Text preset="headline_32/40" fontWeight="bold" color="black">
        Dashboard
      </Text>
      <DashboardWelcome userName={user?.name ?? "Usuário"} role={role} />
      <DashboardQuickActions role={role} />
    </PageContainer>
  );
}
