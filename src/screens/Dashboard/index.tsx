import { CardValidity } from "../../components/Cards/CardValidity";
import { PageContainer } from "../../components/Layout/PageContainer";
import { Text } from "../../components/Text";

export function Dashboard() {
  return (
    <PageContainer className="gap-8">
      <Text preset="headline_32/40" fontWeight="bold" color="black">
        Dashboard
      </Text>
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <CardValidity />
      </div>
    </PageContainer>
  );
}
