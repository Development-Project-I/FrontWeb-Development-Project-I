import clsx from "clsx";
import type { FormEvent } from "react";
import { useCallback, useEffect, useId, useState } from "react";
import { Button } from "../../Button";
import { Icon } from "../../Icon";

export type AccessType = "estoque" | "professor" | "admin";

export interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    accessType: AccessType;
  }) => void | Promise<void>;
}

const accessOptions: {
  id: AccessType;
  title: string;
  description: string;
  icon: string;
}[] = [
  {
    id: "estoque",
    title: "Estoquista",
    description: "Controle de estoque",
    icon: "Package",
  },
  {
    id: "professor",
    title: "Professor",
    description: "Acesso completo",
    icon: "GraduationCap",
  },
  {
    id: "admin",
    title: "Admin",
    description: "Todos os acessos",
    icon: "Shield",
  },
];

function accessLabel(type: AccessType | null): string {
  if (type == null) return "";
  const o = accessOptions.find((x) => x.id === type);
  return o?.title ?? "";
}

function accessIconName(type: AccessType | null): string {
  if (type == null) return "User";
  const o = accessOptions.find((x) => x.id === type);
  return o?.icon ?? "User";
}

export function CreateUserModal({ isOpen, onClose, onAdd }: CreateUserModalProps) {
  const baseId = useId();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessType, setAccessType] = useState<AccessType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = useCallback(() => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setAccessType(null);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const fullName =
    firstName.trim() || lastName.trim()
      ? `${firstName.trim()} ${lastName.trim()}`.trim()
      : "— —";

  const emailDisplay = email.trim() || "—";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (accessType == null || !password.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd?.({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: password.trim(),
        accessType,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-neutral-950/85 backdrop-blur-[1px]"
        aria-label="Fechar modal"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${baseId}-title`}
        aria-describedby={`${baseId}-desc`}
        className="relative z-[101] flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(ev) => ev.stopPropagation()}
      >
        <header className="shrink-0 border-b border-neutral-200 px-6 pb-4 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                <Icon
                  name="User"
                  color="text-violet-600"
                  className="size-6"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>
              <div className="min-w-0">
                <h2
                  id={`${baseId}-title`}
                  className="preset-headline_20/25 font-bold text-neutral-900"
                >
                  Adicionar Novo Usuário
                </h2>
                <p
                  id={`${baseId}-desc`}
                  className="preset-body_14/20 mt-1 font-regular text-neutral-500"
                >
                  Preencha os dados do novo usuário
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
              aria-label="Fechar"
            >
              <Icon name="X" className="size-5" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="space-y-5 px-6 py-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${baseId}-nome`}
                  className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
                >
                  Nome <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Icon
                    name="User"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <input
                    id={`${baseId}-nome`}
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="João"
                    className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-3 text-sm text-neutral-900 outline-none ring-primary/30 placeholder:text-neutral-400 focus:border-primary focus:ring-2"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-sobrenome`}
                  className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
                >
                  Sobrenome <span className="text-primary">*</span>
                </label>
                <input
                  id={`${baseId}-sobrenome`}
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Silva"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900 outline-none ring-primary/30 placeholder:text-neutral-400 focus:border-primary focus:ring-2"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor={`${baseId}-email`}
                className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
              >
                E-mail <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Icon
                  name="Mail"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                  strokeWidth={2}
                  aria-hidden
                />
                <input
                  id={`${baseId}-email`}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joao.silva@gastroplan.com"
                  className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-3 text-sm text-neutral-900 outline-none ring-primary/30 placeholder:text-neutral-400 focus:border-primary focus:ring-2"
                />
              </div>
              <p className="preset-body_12/16 mt-1.5 font-regular text-neutral-500">
                O usuário receberá as credenciais de acesso neste email
              </p>
            </div>

            <div>
              <label
                htmlFor={`${baseId}-senha`}
                className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
              >
                Senha <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Icon
                  name="Lock"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                  strokeWidth={2}
                  aria-hidden
                />
                <input
                  id={`${baseId}-senha`}
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha de acesso"
                  className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-3 text-sm text-neutral-900 outline-none ring-primary/30 placeholder:text-neutral-400 focus:border-primary focus:ring-2"
                />
              </div>
            </div>

            <div>
              <p className="preset-body_14/20 mb-3 font-medium text-neutral-800">
                Tipo de Acesso <span className="text-primary">*</span>
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {accessOptions.map((opt) => {
                  const selected = accessType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAccessType(opt.id)}
                      aria-pressed={selected}
                      className={clsx(
                        "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition",
                        selected
                          ? "border-primary bg-primary/[0.06] shadow-sm"
                          : "border-neutral-200 bg-white hover:border-neutral-300",
                      )}
                    >
                      <span
                        className={clsx(
                          "flex size-12 items-center justify-center rounded-full",
                          selected ? "bg-primary/10 text-primary" : "bg-neutral-100 text-neutral-600",
                        )}
                      >
                        <Icon name={opt.icon} className="size-6" strokeWidth={2} aria-hidden />
                      </span>
                      <span className="preset-body_14/20 font-bold text-neutral-900">
                        {opt.title}
                      </span>
                      <span className="preset-body_12/16 font-regular text-neutral-500">
                        {opt.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {accessType != null ? (
              <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-4">
                <p className="preset-body_14/20 font-bold text-neutral-900">
                  Resumo do Cadastro
                </p>
                <ul className="preset-body_14/20 mt-3 space-y-2 font-regular text-neutral-700">
                  <li>Nome Completo: {fullName}</li>
                  <li>Email: {emailDisplay}</li>
                  <li className="flex flex-wrap items-center gap-2">
                    <span>Tipo de Acesso:</span>
                    <Icon
                      name={accessIconName(accessType)}
                      className="size-4 text-primary"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span className="font-semibold text-neutral-900">
                      {accessLabel(accessType)}
                    </span>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>

          <footer className="flex shrink-0 flex-col-reverse gap-3 bg-white px-6 pb-5 pt-4 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onClose}
              className="preset-button_16/24 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 sm:w-auto"
            >
              Cancelar
            </button>
            <Button
              type="submit"
              title={isSubmitting ? "Salvando..." : "Adicionar Usuário"}
              icon="UserPlus"
              color="bg-primary text-white hover:brightness-110 active:brightness-95"
              className="w-full sm:w-auto"
              disabled={accessType == null || isSubmitting}
            />
          </footer>
        </form>
      </div>
    </div>
  );
}
