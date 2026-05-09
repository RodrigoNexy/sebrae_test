import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-app-bg">
        <span className="ui-logo">S</span>
        <p className="font-sans text-sm font-normal text-muted-foreground">
          Carregando…
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  return children;
}
