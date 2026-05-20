import { SettingsCard } from "../../components/Cards/SettingsCard";
import type { SettingsCardAccent } from "../../components/Cards/SettingsCard";
import { SystemInfoCard } from "../../components/Cards/SystemInfoCard";
import { Text } from "../../components/Text";

interface SettingsItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  accent: SettingsCardAccent;
}

const settingsItems: SettingsItem[] = [
  {
    id: "1",
    icon: "User",
    title: "Perfil",
    description: "Gerencie suas informações pessoais",
    accent: "blue",
  },
  {
    id: "2",
    icon: "Bell",
    title: "Notificações",
    description: "Configure alertas e notificações",
    accent: "amber",
  },
  {
    id: "3",
    icon: "Shield",
    title: "Segurança",
    description: "Senha e autenticação",
    accent: "red",
  },
  {
    id: "4",
    icon: "Database",
    title: "Backup",
    description: "Configure backups automáticos",
    accent: "green",
  },
  {
    id: "5",
    icon: "Palette",
    title: "Aparência",
    description: "Personalize a interface",
    accent: "purple",
  },
  {
    id: "6",
    icon: "Settings",
    title: "Sistema",
    description: "Configurações gerais do sistema",
    accent: "neutral",
  },
];

export function Configuracoes() {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col p-8">
      <Text preset="headline_32/40" fontWeight="bold" color="black">
        Configurações
      </Text>

      <ul className="mt-8 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {settingsItems.map((item) => (
          <li key={item.id}>
            <SettingsCard
              icon={item.icon}
              title={item.title}
              description={item.description}
              accent={item.accent}
            />
          </li>
        ))}
      </ul>

      <SystemInfoCard className="mt-8" />
    </div>
  );
}
