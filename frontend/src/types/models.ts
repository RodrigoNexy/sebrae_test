export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
};

export type Cliente = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  created_at: string;
  updated_at: string;
};

export type Paginated<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
};
