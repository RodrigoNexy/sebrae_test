import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError } from "../api/http";
import { deleteCliente, listClientes } from "../api/clientes";
import type { Cliente } from "../types/models";

export function ClientesPage() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Cliente[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (nextPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await listClientes(nextPage);
      setItems(result.data);
      setLastPage(result.last_page);
      setTotal(result.total);
      setPage(result.current_page);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível carregar os clientes.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(page);
  }, [load, page]);

  async function handleDelete(id: number) {
    if (!window.confirm("Remover este cliente?")) {
      return;
    }
    try {
      await deleteCliente(id);
      void load(page);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível remover.");
      }
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="ui-page-title">Clientes</h1>
          <p className="ui-muted mt-1">
            {total === 0
              ? "Nenhum cadastro ainda."
              : `${total} cliente(s) no total.`}
          </p>
        </div>
        <Link className="ui-btn-primary" to="/clientes/novo">
          Novo cliente
        </Link>
      </div>

      {error ? (
        <div className="ui-alert-error mb-6">{error}</div>
      ) : null}

      <div className="ui-panel">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="ui-table-header-row">
                <th className="ui-table-head-cell rounded-tl-[10px] font-sans">
                  Nome
                </th>
                <th className="ui-table-head-cell font-sans">E-mail</th>
                <th className="ui-table-head-cell font-sans">Cidade</th>
                <th className="ui-table-head-cell rounded-tr-[10px] text-right font-sans">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-app-panel">
              {loading ? (
                <tr>
                  <td
                    className="ui-table-cell text-center text-muted-foreground"
                    colSpan={4}
                  >
                    Carregando…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    className="ui-table-cell text-center text-muted-foreground"
                    colSpan={4}
                  >
                    Nenhum cliente cadastrado.
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-black/10 dark:hover:bg-white/5"
                  >
                    <td className="ui-table-cell font-sans font-semibold">
                      {row.nome}
                    </td>
                    <td className="ui-table-cell ui-table-cell-muted font-sans">
                      {row.email}
                    </td>
                    <td className="ui-table-cell ui-table-cell-muted font-sans">
                      {row.cidade} / {row.estado}
                    </td>
                    <td className="ui-table-cell text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Link
                          className="ui-btn-outline ui-btn-outline-sm ui-btn-outline-primary"
                          to={`/clientes/${String(row.id)}/editar`}
                        >
                          Editar
                        </Link>
                        <button
                          className="ui-btn-outline ui-btn-outline-sm ui-btn-outline-danger"
                          type="button"
                          onClick={() => void handleDelete(row.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {lastPage > 1 ? (
          <div className="flex items-center justify-between border-t border-border px-5 py-4 text-sm text-muted-foreground">
            <span>
              Página {page} de {lastPage}
            </span>
            <div className="flex gap-2">
              <button
                className="ui-btn-outline px-4 py-2 disabled:opacity-35"
                disabled={page <= 1 || loading}
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </button>
              <button
                className="ui-btn-outline px-4 py-2 disabled:opacity-35"
                disabled={page >= lastPage || loading}
                type="button"
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
