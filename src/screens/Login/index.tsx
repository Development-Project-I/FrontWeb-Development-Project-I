import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Icon } from "../../components/Icon";
import { Text } from "../../components/Text";
import { authService } from "../../services/auth.service";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await authService.postLogin({
        identificador: email.trim(),
        password,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "E-mail ou senha incorretos.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100/90 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <header className="bg-gradient-to-r from-blue-600 via-blue-600 to-violet-600 px-8 py-10 text-center">
          <Text preset="headline_20/25" fontWeight="bold" color="white">
            GastroPlan
          </Text>
          <p className="mt-2 text-sm font-medium text-white/95">
            Sistema de Gerenciamento de Gastronomia
          </p>
        </header>

        <div className="px-8 py-8">
          <h2 className="text-center text-xl font-bold text-neutral-900">
            Bem-vindo de volta
          </h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="preset-body_14/20 mb-1.5 block font-medium text-neutral-700"
              >
                Email
              </label>
              <div className="relative">
                <Icon
                  name="Mail"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
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
                  className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-3 text-sm text-neutral-900 outline-none ring-primary/30 placeholder:text-neutral-400 focus:border-primary focus:ring-2"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="preset-body_14/20 mb-1.5 block font-medium text-neutral-700"
              >
                Senha
              </label>
              <div className="relative">
                <Icon
                  name="Lock"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
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
                  className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-3 text-sm text-neutral-900 outline-none ring-primary/30 placeholder:text-neutral-400 focus:border-primary focus:ring-2"
                />
              </div>
            </div>

            {error ? (
              <p
                className="preset-body_14/20 text-center font-medium text-red-600"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              title={isSubmitting ? "Entrando..." : "Entrar"}
              icon="LogIn"
              color="bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md hover:brightness-110 active:brightness-95"
              className="w-full py-3"
              disabled={isSubmitting}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
