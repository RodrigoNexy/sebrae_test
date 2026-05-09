const TOKEN_KEY = "auth_token";

const apiRoot = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return apiRoot ? `${apiRoot}${normalized}` : normalized;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export class ApiError extends Error {
  readonly status: number;
  readonly errors: Record<string, string[]> | undefined;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

type LaravelErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

export async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const url = apiUrl(path);
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (
    init.body !== undefined &&
    !(init.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const token = getStoredToken();
  const hadAuth = Boolean(token);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, { ...init, headers });

  if (response.status === 401 && hadAuth) {
    setStoredToken(null);
    window.dispatchEvent(new CustomEvent("auth:session-expired"));
  }

  return response;
}

export async function parseJson<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const body = text ? (JSON.parse(text) as LaravelErrorBody | T) : null;

  if (!response.ok) {
    const errBody = body as LaravelErrorBody | null;
    throw new ApiError(
      errBody?.message ?? response.statusText,
      response.status,
      errBody?.errors,
    );
  }

  return body as T;
}
