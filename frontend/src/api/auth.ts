import { apiFetch, parseJson, setStoredToken } from "./http";
import type { User } from "../types/models";

type AuthPayload = {
  token: string;
  token_type: string;
  user: User;
};

export async function loginRequest(
  email: string,
  password: string,
): Promise<User> {
  const response = await apiFetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const data = await parseJson<AuthPayload>(response);
  setStoredToken(data.token);
  return data.user;
}

export async function registerRequest(payload: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<User> {
  const response = await apiFetch("/api/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await parseJson<AuthPayload>(response);
  setStoredToken(data.token);
  return data.user;
}

export async function fetchCurrentUser(): Promise<User> {
  const response = await apiFetch("/api/user");
  const data = await parseJson<{ user: User }>(response);
  return data.user;
}

export async function logoutRequest(): Promise<void> {
  const response = await apiFetch("/api/logout", { method: "POST" });
  await parseJson<{ message: string }>(response);
}
