import { apiFetch, parseJson } from "./http";
import type { Cliente, Paginated } from "../types/models";

export async function listClientes(page = 1): Promise<Paginated<Cliente>> {
  const response = await apiFetch(`/api/clientes?page=${page}`);
  return parseJson<Paginated<Cliente>>(response);
}

export async function getCliente(id: number): Promise<Cliente> {
  const response = await apiFetch(`/api/clientes/${id}`);
  return parseJson<Cliente>(response);
}

export async function createCliente(
  payload: Omit<
    Cliente,
    "id" | "created_at" | "updated_at"
  >,
): Promise<Cliente> {
  const response = await apiFetch("/api/clientes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return parseJson<Cliente>(response);
}

export async function updateCliente(
  id: number,
  payload: Omit<
    Cliente,
    "id" | "created_at" | "updated_at"
  >,
): Promise<Cliente> {
  const response = await apiFetch(`/api/clientes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return parseJson<Cliente>(response);
}

export async function deleteCliente(id: number): Promise<void> {
  const response = await apiFetch(`/api/clientes/${id}`, {
    method: "DELETE",
  });
  await parseJson<void>(response);
}
