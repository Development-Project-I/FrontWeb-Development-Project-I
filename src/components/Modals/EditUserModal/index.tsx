import clsx from "clsx";
import type { FormEvent } from "react";
import { useCallback, useEffect, useId, useState } from "react";
import type { AccessType } from "../CreateUserModal";
import { Button } from "../../Button";
import { Icon } from "../../Icon";

export type EditUserModalMode = "admin" | "profile";

export interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: EditUserModalMode;
  initialData?: {
    firstName: string;
    lastName: string;
    email: string;
    accessType: AccessType;
  };
  onSave?: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
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

const inputClass =
  "w-full rounded-lg border border-neutral-200 py-2.5 px-3 text-sm text-neutral-900 outline-none ring-primary/30 placeholder:text-neutral-400 focus:border-primary focus:ring-2";

export function EditUserModal({
  isOpen,
  onClose,
  mode = "admin",
  initialData,
  onSave,
}: EditUserModalProps) {
  const isProfileMode = mode === "profile";
  const baseId = useId();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessType, setAccessType] = useState<AccessType>("professor");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = useCallback(() => {
    setFirstName(initialData?.firstName ?? "");
    setLastName(initialData?.lastName ?? "");
    setEmail(initialData?.email ?? "");
    setPassword("");
    setAccessType(initialData?.accessType ?? "professor");
  }, [initialData]);

  useEffect(() => {
    if (isOpen) reset();
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave?.({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: password.trim() || undefined,
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
        className="relative z-[101] flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
        onClick={(ev) => ev.stopPropagation()}
      >
        <header className="shrink-0 border-b border-neutral-200 px-6 pb-4 pt-6 dark:border-slate-700">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50">
                <Icon
                  name="SquarePen"
                  color="text-blue-600"
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
                  {isProfileMode ? "Meu Perfil" : "Editar Usuário"}
                </h2>
                <p className="preset-body_14/20 mt-1 text-neutral-500">
                  {isProfileMode
                    ? "Atualize suas informações pessoais"
                    : "Atualize os dados do usuário"}
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${baseId}-first`}
                  className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
                >
                  Nome <span className="text-primary">*</span>
                </label>
                <input
                  id={`${baseId}-first`}
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-last`}
                  className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
                >
                  Sobrenome
                </label>
                <input
                  id={`${baseId}-last`}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
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
              <input
                id={`${baseId}-email`}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor={`${baseId}-password`}
                className="preset-body_14/20 mb-1.5 block font-medium text-neutral-800"
              >
                Nova senha
              </label>
              <input
                id={`${baseId}-password`}
                type="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Deixe em branco para manter a atual"
                className={inputClass}
              />
            </div>

            {!isProfileMode ? (
              <fieldset>
                <legend className="preset-body_14/20 mb-2 font-medium text-neutral-800">
                  Tipo de acesso
                </legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {accessOptions.map((option) => (
                    <label
                      key={option.id}
                      className={clsx(
                        "flex cursor-pointer flex-col rounded-xl border p-3 transition-colors",
                        accessType === option.id
                          ? "border-primary bg-blue-50/50 dark:bg-primary/15"
                          : "border-neutral-200 hover:border-neutral-300 dark:border-slate-600 dark:hover:border-slate-500",
                      )}
                    >
                      <input
                        type="radio"
                        name={`${baseId}-access`}
                        value={option.id}
                        checked={accessType === option.id}
                        onChange={() => setAccessType(option.id)}
                        className="sr-only"
                      />
                      <span className="preset-body_14/20 font-semibold text-neutral-900">
                        {option.title}
                      </span>
                      <span className="preset-body_12/16 text-neutral-500">
                        {option.description}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}
          </div>

          <footer className="flex shrink-0 flex-col-reverse gap-3 bg-white px-6 pb-5 pt-4 dark:bg-slate-900 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onClose}
              className="preset-button_16/24 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 sm:w-auto"
            >
              Cancelar
            </button>
            <Button
              type="submit"
              title={isSubmitting ? "Salvando..." : "Salvar alterações"}
              icon="Check"
              color="bg-primary text-white hover:brightness-110 active:brightness-95"
              className="w-full sm:w-auto"
              disabled={!firstName.trim() || !email.trim() || isSubmitting}
            />
          </footer>
        </form>
      </div>
    </div>
  );
}
