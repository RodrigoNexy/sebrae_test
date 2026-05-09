import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const laravelBladeUrl =
  import.meta.env.VITE_LARAVEL_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-svh bg-app-bg">
      <header className="border-b border-border bg-app-bg">
        <div className="mx-auto flex max-w-[1920px] flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="ui-logo">S</span>
            <div>
              <p className="font-sans text-sm font-semibold text-foreground">
                Seabre
              </p>
              <p className="font-sans text-xs font-normal text-muted-foreground">
                CRUD de clientes
              </p>
            </div>
          </div>

          <nav className="ui-tab-track flex-wrap">
            <NavLink
              className={({ isActive }) =>
                ["ui-tab", isActive ? "ui-tab-active" : ""].join(" ")
              }
              end
              to="/clientes"
            >
              Clientes
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                ["ui-tab", isActive ? "ui-tab-active" : ""].join(" ")
              }
              to="/clientes/novo"
            >
              Novo cliente
            </NavLink>
            <a
              className="ui-tab text-muted-foreground"
              href={laravelBladeUrl}
              rel="noreferrer"
              target="_blank"
            >
              Blade ↗
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden max-w-[180px] truncate font-sans text-sm font-normal text-muted-foreground sm:inline">
              {user?.name}
            </span>
            <button
              className="ui-btn-outline"
              type="button"
              onClick={() => {
                void logout();
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1920px] gap-8 px-5 py-8">{children}</main>
    </div>
  );
}
