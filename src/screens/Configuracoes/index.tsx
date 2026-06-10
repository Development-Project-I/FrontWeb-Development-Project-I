import { useCallback, useMemo, useState } from "react";
import { SettingsCard } from "../../components/Cards/SettingsCard";
import type { SettingsCardAccent } from "../../components/Cards/SettingsCard";
import { SystemInfoCard } from "../../components/Cards/SystemInfoCard";
import { AppearanceModal } from "../../components/Modals/AppearanceModal";
import { EditUserModal } from "../../components/Modals/EditUserModal";
import type { AccessType } from "../../components/Modals/CreateUserModal";
import { ApiUserRole } from "../../constants/apiUserRole";
import { useAppearance } from "../../contexts/AppearanceContext";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { usersService } from "../../services/users.service";
import {
  apiRoleToUserRole,
  mapApiUserToAuthUser,
  userRoleToAccessType,
} from "../../utils/apiMappers";
import { Text } from "../../components/Text";

interface SettingsItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  accent: SettingsCardAccent;
  action?: "profile" | "appearance";
}

const allSettingsItems: SettingsItem[] = [
  {
    id: "profile",
    icon: "User",
    title: "Perfil",
    description: "Gerencie suas informações pessoais",
    accent: "blue",
    action: "profile",
  },
  {
    id: "notifications",
    icon: "Bell",
    title: "Notificações",
    description: "Configure alertas e notificações",
    accent: "amber",
  },
  {
    id: "security",
    icon: "Shield",
    title: "Segurança",
    description: "Senha e autenticação",
    accent: "red",
  },
  {
    id: "backup",
    icon: "Database",
    title: "Backup",
    description: "Configure backups automáticos",
    accent: "green",
  },
  {
    id: "appearance",
    icon: "Palette",
    title: "Aparência",
    description: "Personalize a interface",
    accent: "purple",
    action: "appearance",
  },
  {
    id: "system",
    icon: "Settings",
    title: "Sistema",
    description: "Configurações gerais do sistema",
    accent: "neutral",
  },
];

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  accessType: AccessType;
}

const sharedActions = new Set<SettingsItem["action"]>(["profile", "appearance"]);

export function Configuracoes() {
  const { user, updateUser } = useAuth();
  const { settings, updateSettings } = useAppearance();
  const { showToast } = useToast();
  const [profileOpen, setProfileOpen] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const visibleSettings = useMemo(() => {
    if (user?.role === ApiUserRole.ADMIN) return allSettingsItems;
    return allSettingsItems.filter((item) => sharedActions.has(item.action));
  }, [user?.role]);

  const buildProfileData = useCallback(
    (
      name: string,
      sobrenome: string | null | undefined,
      email: string,
      role: AccessType,
    ): ProfileFormData => ({
      firstName: name,
      lastName: sobrenome ?? "",
      email,
      accessType: role,
    }),
    [],
  );

  const openProfile = useCallback(async () => {
    if (!user) return;

    setLoadingProfile(true);
    try {
      const { data } = await usersService.getUserById(String(user.id));
      setProfileData(
        buildProfileData(
          data.name,
          data.sobrenome,
          data.email,
          userRoleToAccessType(apiRoleToUserRole(data.role)),
        ),
      );
      setProfileOpen(true);
    } catch (error) {
      setProfileData(
        buildProfileData(
          user.name,
          "",
          user.email,
          userRoleToAccessType(apiRoleToUserRole(user.role)),
        ),
      );
      setProfileOpen(true);

      const message =
        error instanceof Error ? error.message : "Erro ao carregar perfil.";
      showToast(
        "Aviso",
        `${message} Exibindo dados da sessão atual.`,
        "warning",
      );
    } finally {
      setLoadingProfile(false);
    }
  }, [user, showToast, buildProfileData]);

  async function handleSaveProfile(payload: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    accessType: AccessType;
  }) {
    if (!user) return;

    try {
      const { data } = await usersService.patchUser(String(user.id), {
        name: payload.firstName.trim(),
        sobrenome: payload.lastName.trim(),
        email: payload.email.trim(),
        ...(payload.password ? { password: payload.password } : {}),
      });

      updateUser(mapApiUserToAuthUser(data, user.accessToken));
      showToast(
        "Perfil atualizado",
        "Suas informações foram salvas com sucesso.",
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao atualizar perfil.";
      showToast("Erro", message, "error");
      throw error;
    }
  }

  function handleSaveAppearance(nextSettings: typeof settings) {
    updateSettings(nextSettings);
    showToast(
      "Aparência atualizada",
      "As preferências visuais foram aplicadas.",
      "success",
    );
  }

  function handleCardClick(item: SettingsItem) {
    if (item.action === "profile") {
      void openProfile();
      return;
    }

    if (item.action === "appearance") {
      setAppearanceOpen(true);
      return;
    }

    showToast(
      "Em breve",
      "Esta configuração ainda não está disponível.",
      "warning",
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col p-8">
      <Text preset="headline_32/40" fontWeight="bold" color="black">
        Configurações
      </Text>

      <ul className="mt-8 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleSettings.map((item) => (
          <li key={item.id}>
            <SettingsCard
              icon={item.icon}
              title={item.title}
              description={item.description}
              accent={item.accent}
              onClick={() => handleCardClick(item)}
              isLoading={item.action === "profile" && loadingProfile}
            />
          </li>
        ))}
      </ul>

      <SystemInfoCard className="mt-8" />

      <EditUserModal
        isOpen={profileOpen}
        mode="profile"
        onClose={() => {
          setProfileOpen(false);
          setProfileData(null);
        }}
        initialData={profileData ?? undefined}
        onSave={handleSaveProfile}
      />

      <AppearanceModal
        isOpen={appearanceOpen}
        onClose={() => setAppearanceOpen(false)}
        initialSettings={settings}
        onSave={handleSaveAppearance}
      />
    </div>
  );
}
