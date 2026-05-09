import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../api/http";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setSubmitting(true);
    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      navigate("/clientes", { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        setFieldErrors(error.errors ?? {});
        setFormError(error.message);
      } else {
        setFormError("Não foi possível criar a conta.");
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
          <h1 className="ui-page-title">Criar conta</h1>
          <p className="ui-muted mx-auto mt-2 max-w-sm">
            Registro via API — mesmo e-mail nos dois fluxos (Blade ou React).
          </p>
        </div>

        <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
          <div>
            <label className="ui-label" htmlFor="name">
              Nome
            </label>
            <input
              autoComplete="name"
              className="ui-input"
              id="name"
              name="name"
              required
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            {fieldErrors.name?.[0] ? (
              <p className="mt-2 text-sm text-destructive">{fieldErrors.name[0]}</p>
            ) : null}
          </div>

          <div>
            <label className="ui-label" htmlFor="email-r">
              E-mail
            </label>
            <input
              autoComplete="email"
              className="ui-input"
              id="email-r"
              name="email"
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {fieldErrors.email?.[0] ? (
              <p className="mt-2 text-sm text-destructive">{fieldErrors.email[0]}</p>
            ) : null}
          </div>

          <div>
            <label className="ui-label" htmlFor="password-r">
              Senha
            </label>
            <input
              autoComplete="new-password"
              className="ui-input"
              id="password-r"
              name="password"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {fieldErrors.password?.[0] ? (
              <p className="mt-2 text-sm text-destructive">
                {fieldErrors.password[0]}
              </p>
            ) : null}
          </div>

          <div>
            <label className="ui-label" htmlFor="password_confirmation">
              Confirmar senha
            </label>
            <input
              autoComplete="new-password"
              className="ui-input"
              id="password_confirmation"
              name="password_confirmation"
              required
              type="password"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
            />
          </div>

          {formError ? (
            <div className="ui-alert-error">{formError}</div>
          ) : null}

          <button
            className="ui-btn-primary mt-2 w-full"
            disabled={submitting}
            type="submit"
          >
            {submitting ? "Criando…" : "Cadastrar"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link
            className="font-semibold text-primary hover:underline"
            to="/login"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
