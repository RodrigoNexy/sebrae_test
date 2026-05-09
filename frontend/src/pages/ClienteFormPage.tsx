import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { ApiError } from "../api/http";
import { createCliente, getCliente, updateCliente } from "../api/clientes";
import { useViaCep } from "../hooks/useViaCep";

type FormState = {
  nome: string;
  email: string;
  telefone: string;
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
};

const emptyForm: FormState = {
  nome: "",
  email: "",
  telefone: "",
  cep: "",
  rua: "",
  bairro: "",
  cidade: "",
  estado: "",
};

export function ClienteFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const fetchAddress = useViaCep();

  const isCreate = location.pathname.endsWith("/novo");
  const editId = params.id !== undefined ? Number(params.id) : Number.NaN;

  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(!isCreate);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (isCreate || !Number.isFinite(editId)) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    getCliente(editId)
      .then((data) => {
        if (cancelled) return;
        setForm({
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          cep: data.cep,
          rua: data.rua,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.estado,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError) {
          setLoadError(err.message);
        } else {
          setLoadError("Não foi possível carregar o cliente.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [editId, isCreate]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  async function handleCepBlur() {
    const filled = await fetchAddress(form.cep);
    if (!filled.rua && !filled.bairro && !filled.cidade && !filled.estado) {
      return;
    }
    setForm((previous) => ({
      ...previous,
      rua: filled.rua ?? previous.rua,
      bairro: filled.bairro ?? previous.bairro,
      cidade: filled.cidade ?? previous.cidade,
      estado: filled.estado ?? previous.estado,
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setSubmitting(true);

    const payload = {
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      cep: form.cep,
      rua: form.rua,
      bairro: form.bairro,
      cidade: form.cidade,
      estado: form.estado.toUpperCase().slice(0, 2),
    };

    try {
      if (isCreate) {
        await createCliente(payload);
      } else if (Number.isFinite(editId)) {
        await updateCliente(editId, payload);
      }
      navigate("/clientes");
    } catch (error) {
      if (error instanceof ApiError) {
        setFieldErrors(error.errors ?? {});
        setFormError(error.message);
      } else {
        setFormError("Não foi possível salvar.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const title = isCreate ? "Novo cliente" : "Editar cliente";

  if (!isCreate && !Number.isFinite(editId)) {
    return <div className="ui-alert-error">ID inválido.</div>;
  }

  if (loading) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Carregando dados…
      </p>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-4">
        <div className="ui-alert-error">{loadError}</div>
        <Link
          className="text-sm font-semibold text-primary hover:underline"
          to="/clientes"
        >
          ← Voltar à lista
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="ui-page-title">{title}</h1>
          <p className="ui-muted mt-1">
            Validação igual ao Laravel; CEP com ViaCEP no blur.
          </p>
        </div>
        <Link
          className="text-sm font-normal text-muted-foreground transition hover:text-foreground"
          to="/clientes"
        >
          ← Lista
        </Link>
      </div>

      <form
        className="ui-panel grid max-w-3xl gap-4 p-6 sm:grid-cols-2 sm:p-8"
        onSubmit={(event) => void handleSubmit(event)}
      >
        <div className="sm:col-span-2">
          <label className="ui-label" htmlFor="nome">
            Nome
          </label>
          <input
            className="ui-input"
            id="nome"
            required
            type="text"
            value={form.nome}
            onChange={(event) => setField("nome", event.target.value)}
          />
          {fieldErrors.nome?.[0] ? (
            <p className="mt-2 text-sm text-destructive">{fieldErrors.nome[0]}</p>
          ) : null}
        </div>

        <div>
          <label className="ui-label" htmlFor="email">
            E-mail
          </label>
          <input
            className="ui-input"
            id="email"
            required
            type="email"
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
          />
          {fieldErrors.email?.[0] ? (
            <p className="mt-2 text-sm text-destructive">{fieldErrors.email[0]}</p>
          ) : null}
        </div>

        <div>
          <label className="ui-label" htmlFor="telefone">
            Telefone
          </label>
          <input
            className="ui-input"
            id="telefone"
            required
            type="text"
            value={form.telefone}
            onChange={(event) => setField("telefone", event.target.value)}
          />
          {fieldErrors.telefone?.[0] ? (
            <p className="mt-2 text-sm text-destructive">
              {fieldErrors.telefone[0]}
            </p>
          ) : null}
        </div>

        <div>
          <label className="ui-label" htmlFor="cep">
            CEP
          </label>
          <input
            className="ui-input"
            id="cep"
            maxLength={9}
            placeholder="00000-000"
            required
            type="text"
            value={form.cep}
            onBlur={() => void handleCepBlur()}
            onChange={(event) => setField("cep", event.target.value)}
          />
          {fieldErrors.cep?.[0] ? (
            <p className="mt-2 text-sm text-destructive">{fieldErrors.cep[0]}</p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label className="ui-label" htmlFor="rua">
            Rua / logradouro
          </label>
          <input
            className="ui-input"
            id="rua"
            required
            type="text"
            value={form.rua}
            onChange={(event) => setField("rua", event.target.value)}
          />
          {fieldErrors.rua?.[0] ? (
            <p className="mt-2 text-sm text-destructive">{fieldErrors.rua[0]}</p>
          ) : null}
        </div>

        <div>
          <label className="ui-label" htmlFor="bairro">
            Bairro
          </label>
          <input
            className="ui-input"
            id="bairro"
            required
            type="text"
            value={form.bairro}
            onChange={(event) => setField("bairro", event.target.value)}
          />
          {fieldErrors.bairro?.[0] ? (
            <p className="mt-2 text-sm text-destructive">
              {fieldErrors.bairro[0]}
            </p>
          ) : null}
        </div>

        <div>
          <label className="ui-label" htmlFor="cidade">
            Cidade
          </label>
          <input
            className="ui-input"
            id="cidade"
            required
            type="text"
            value={form.cidade}
            onChange={(event) => setField("cidade", event.target.value)}
          />
          {fieldErrors.cidade?.[0] ? (
            <p className="mt-2 text-sm text-destructive">
              {fieldErrors.cidade[0]}
            </p>
          ) : null}
        </div>

        <div>
          <label className="ui-label" htmlFor="estado">
            UF
          </label>
          <input
            className="ui-input"
            id="estado"
            maxLength={2}
            placeholder="SP"
            required
            type="text"
            value={form.estado}
            onChange={(event) => setField("estado", event.target.value.toUpperCase())}
          />
          {fieldErrors.estado?.[0] ? (
            <p className="mt-2 text-sm text-destructive">
              {fieldErrors.estado[0]}
            </p>
          ) : null}
        </div>

        {formError ? (
          <div className="ui-alert-error sm:col-span-2">{formError}</div>
        ) : null}

        <div className="flex flex-wrap gap-3 pt-2 sm:col-span-2">
          <button
            className="ui-btn-primary"
            disabled={submitting}
            type="submit"
          >
            {submitting ? "Salvando…" : "Salvar"}
          </button>
          <Link className="ui-btn-outline" to="/clientes">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
