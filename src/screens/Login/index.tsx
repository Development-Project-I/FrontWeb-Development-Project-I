import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Icon } from "../../components/Icon";
import { getHomeRoute } from "../../config/permissions";
import { normalizeAuthUser, useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/auth.service";

const highlights = [
  { icon: "Package", label: "Controle de estoque" },
  { icon: "BookOpen", label: "Planejamento de aulas" },
] as const;

function LoginDecoration() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -left-16 top-10 size-56 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -right-10 bottom-0 size-48 rounded-full bg-violet-400/20 blur-2xl" />
      <Icon
        name="Soup"
        className="absolute right-8 top-16 size-16 text-white/10"
        strokeWidth={1.5}
      />
      <Icon
        name="Wheat"
        className="absolute bottom-20 left-6 size-12 text-white/10"
        strokeWidth={1.5}
      />
      <Icon
        name="Salad"
        className="absolute bottom-8 right-20 size-10 text-white/10"
        strokeWidth={1.5}
      />
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { data } = await authService.postLogin({
        identificador: email.trim(),
        password,
      });

      const user = normalizeAuthUser(data.user);
      if (!user) {
        throw new Error("Resposta de login inválida.");
      }

      login({
        ...user,
        accessToken:
          typeof data.accessToken === "string" ? data.accessToken : undefined,
      });
      navigate(getHomeRoute(user.role), { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "E-mail ou senha incorretos.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-violet-100 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div
        className="pointer-events-none absolute -left-24 top-1/4 size-72 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-1/4 size-80 rounded-full bg-violet-400/15 blur-3xl"
        aria-hidden
      />
      <Icon
        name="ChefHat"
        className="pointer-events-none absolute left-[8%] top-[12%] size-20 text-primary/10 dark:text-primary/20"
        strokeWidth={1.25}
        aria-hidden
      />
      <Icon
        name="UtensilsCrossed"
        className="pointer-events-none absolute bottom-[10%] right-[10%] size-16 text-violet-500/15"
        strokeWidth={1.25}
        aria-hidden
      />

      <div className="relative z-10 grid w-full max-w-4xl overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-2xl shadow-primary/10 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/90 lg:grid-cols-[1.05fr_1fr]">
        <section className="relative order-2 overflow-hidden bg-gradient-to-br from-primary via-blue-600 to-violet-600 px-8 py-10 text-white lg:order-1 lg:px-10 lg:py-12">
          <LoginDecoration />

          <div className="relative z-10">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
              <Icon name="ChefHat" className="size-7 text-white" strokeWidth={2} />
            </div>

            <h1 className="preset-headline_32/40 mt-6 font-bold tracking-tight">
              GastroPlan
            </h1>
            <p className="preset-body_16/24 mt-2 max-w-sm text-white/90">
              Sistema de gerenciamento de estoque e planejamento de aulas
              gastronômicas.
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              {highlights.map(({ icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur-sm"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                    <Icon name={icon} className="size-4 text-white" strokeWidth={2} />
                  </span>
                  <span className="preset-body_14/20 font-medium">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="order-1 flex flex-col justify-center px-8 py-10 lg:order-2 lg:px-10 lg:py-12">
          <div className="mx-auto w-full max-w-sm">
            <p className="preset-tag_12/16 font-semibold uppercase tracking-wider text-primary">
              Acesso ao sistema
            </p>
            <h2 className="preset-headline_24/32 mt-2 font-bold text-neutral-900 dark:text-slate-100">
              Bem-vindo
            </h2>
            <p className="preset-body_14/20 mt-2 text-neutral-500 dark:text-slate-400">
              Entre com suas credenciais para gerenciar ingredientes, aulas e
              equipe.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="login-email"
                  className="preset-body_14/20 mb-1.5 block font-medium text-neutral-700 dark:text-slate-300"
                >
                  E-mail
                </label>
                <div className="relative">
                  <Icon
                    name="Mail"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400 dark:text-slate-500"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@gastroplan.com"
                    className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-10 pr-3 text-sm text-neutral-900 outline-none ring-primary/30 placeholder:text-neutral-400 focus:border-primary focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="preset-body_14/20 mb-1.5 block font-medium text-neutral-700 dark:text-slate-300"
                >
                  Senha
                </label>
                <div className="relative">
                  <Icon
                    name="Lock"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400 dark:text-slate-500"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-10 pr-3 text-sm text-neutral-900 outline-none ring-primary/30 placeholder:text-neutral-400 focus:border-primary focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {error ? (
                <p
                  className="preset-body_14/20 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center font-medium text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                title={isSubmitting ? "Entrando..." : "Entrar"}
                icon="LogIn"
                color="bg-gradient-to-r from-primary via-blue-600 to-violet-600 text-white shadow-lg shadow-primary/25 hover:brightness-110 active:brightness-95"
                className="w-full rounded-xl py-3"
                disabled={isSubmitting}
              />
            </form>

            <p className="preset-body_12/16 mt-8 text-center text-neutral-400 dark:text-slate-500">
              Organize sua cozinha com planejamento inteligente
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
