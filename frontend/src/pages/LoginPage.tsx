import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../api/http";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/clientes", { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        setFieldErrors(error.errors ?? {});
        setFormError(error.message);
      } else {
        setFormError("Não foi possível entrar. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col justify-center bg-app-bg px-5 py-16">
      <div className="ui-auth-card relative mx-auto w-full max-w-md p-8 md:p-10">
        <div className="mb-8 text-center">
          <div className="ui-logo mx-auto mb-6">S</div>
          <h1 className="ui-page-title">Entrar</h1>
          <p className="ui-muted mx-auto mt-2 max-w-sm">
            Mesma conta do Blade ou cadastro pelo React — API Sanctum.
          </p>
        </div>

        <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
          <div>
            <label className="ui-label" htmlFor="email">
              E-mail
            </label>
            <input
              autoComplete="email"
              className="ui-input"
              id="email"
              name="email"
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {fieldErrors.email?.[0] ? (
              <p className="mt-2 text-sm font-normal text-destructive">
                {fieldErrors.email[0]}
              </p>
            ) : null}
          </div>

          <div>
            <label className="ui-label" htmlFor="password">
              Senha
            </label>
            <input
              autoComplete="current-password"
              className="ui-input"
              id="password"
              name="password"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {fieldErrors.password?.[0] ? (
              <p className="mt-2 text-sm font-normal text-destructive">
                {fieldErrors.password[0]}
              </p>
            ) : null}
          </div>

          {formError ? (
            <div className="ui-alert-error">{formError}</div>
          ) : null}

          <button
            className="ui-btn-primary w-full"
            disabled={submitting}
            type="submit"
          >
            {submitting ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link
            className="font-semibold text-primary hover:underline"
            to="/register"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
