import { CardValidity } from "../../components/Cards/CardValidity";
import { Text } from "../../components/Text";

export function Dashboard() {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-8 p-8">
      <Text preset="headline_32/40" fontWeight="bold" color="black">
        Dashboard
      </Text>
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <CardValidity />
      </div>
    </div>
  );
}
