# CRUD de clientes — Laravel

![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

> **Resumo:** aplicação para cadastro de clientes (teste técnico), com **login**, **CRUD completo** protegido por autenticação e **preenchimento de endereço via CEP** (ViaCEP). O **backend** é **Laravel 12** (telas **Blade** com Breeze + **API REST** com **Sanctum**). O **frontend** em **`frontend/`** é uma **SPA em React** (TypeScript, Vite, Tailwind) que consome a mesma API. O ambiente Docker Compose sobe **PHP/Laravel + MySQL**; o React roda à parte no host com `npm run dev`.

Checklist de fases de desenvolvimento: [`TASKS.md`](./TASKS.md).

---

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ou Docker Engine + Docker Compose v2)
- Para o **frontend React**: [Node.js](https://nodejs.org/) **20+** (recomendado; compatível com o Vite do projeto) e npm
- Opcional (sem Docker no backend): PHP ^8.2 e [Composer](https://getcomposer.org/)

---

## Execução

Na **raiz do repositório** (onde está o `docker-compose.yml`):

1. (Opcional) Copie o exemplo de variáveis da raiz:

   ```bash
   copy .env.example .env
   ```

   No Linux/macOS: `cp .env.example .env`

2. Suba os containers:

   ```bash
   docker compose up --build
   ```

3. Acesse **http://localhost:8000** (ou a porta em `APP_PORT` no `.env` da raiz).

Para rodar em segundo plano:

```bash
docker compose up --build -d
```

Parar mantendo o volume do MySQL:

```bash
docker compose down
```

Apagar também os dados do banco:

```bash
docker compose down -v
```

> Na primeira subida, o entrypoint do container **laravel** pode executar `composer install`, gerar `APP_KEY` e `php artisan migrate` contra o MySQL.

---

## Frontend React

SPA independente do build Blade do Laravel: **React 19**, **TypeScript**, **Vite 6**, **Tailwind CSS 4** e **React Router**. Implementa **login**, **registro**, **listagem paginada**, **criação/edição** de clientes e **ViaCEP** no formulário, falando com o Laravel apenas via **HTTP JSON** (`/api/...`).

### Autenticação e API

- **Laravel Sanctum** emite tokens **Bearer** (`POST /api/login`, `POST /api/register`; rotas protegidas com `auth:sanctum`).
- Rotas definidas em [`app/routes/api.php`](./app/routes/api.php) (prefixo automático **`/api`**).
- O React guarda o token em `localStorage` e envia o header `Authorization` nas chamadas autenticadas.
- Lista completa de métodos, paths e corpos JSON: secção [Referência da API REST](#referência-da-api-rest).

### Executar o frontend em desenvolvimento

Com o **Laravel acessível em `http://localhost:8000`** (Docker Compose ou `php artisan serve`):

```bash
cd frontend
npm install
npm run dev
```

Abra **http://localhost:5173**. O Vite está configurado para **proxy** de **`/api`** para **`http://localhost:8000`**, assim o navegador chama apenas o origin do Vite e evita problemas de CORS no dia a dia.

### Build de produção (frontend)

```bash
cd frontend
npm run build
```

O resultado fica em `frontend/dist/`. Para servir esse build junto ao Laravel ou atrás de um CDN, configure a URL da API se não houver proxy (variável **`VITE_API_URL`** apontando para o host do Laravel).

### Variáveis opcionais (`frontend/.env`)

Copie [`frontend/.env.example`](./frontend/.env.example) para `frontend/.env` se precisar ajustar links ou API absoluta:

| Variável | Descrição |
|----------|-----------|
| `VITE_LARAVEL_URL` | URL base do Laravel usada no link “Blade” do layout (ex.: `http://localhost:8000`). |
| `VITE_API_URL` | Se preenchida, prefixa todas as chamadas da camada HTTP (útil sem proxy ou em deploy separado). Deixe vazio no dev com Vite para usar caminhos relativos `/api`. |

### Organização útil no código React

| Área | Pasta / ficheiros |
|------|-------------------|
| Chamadas HTTP e token | `frontend/src/api/` (`http.ts`, `auth.ts`, `clientes.ts`) |
| Rotas e páginas | `frontend/src/App.tsx`, `frontend/src/pages/` |
| Estilos e tokens UI | `frontend/src/index.css` (classes `ui-*`) |

---

## Referência da API REST

Base **`{APP_URL}/api`** (ex.: **`http://localhost:8000/api`**). Envie **`Accept: application/json`**; nos fluxos de escrita, **`Content-Type: application/json`**.

### Autenticação (Laravel Sanctum)

| Método | Endpoint | Protegida | Corpo JSON | Resposta / notas |
|--------|----------|-----------|------------|------------------|
| `POST` | `/api/register` | Não | `name`, `email`, `password`, `password_confirmation` | **201** — `token`, `token_type` (`Bearer`), `user` (`id`, `name`, `email`, …). |
| `POST` | `/api/login` | Não | `email`, `password` | **200** — mesmo formato do registo (novo token **Bearer**). |
| `GET` | `/api/user` | Sim (`Authorization: Bearer …`) | — | **200** — `{ "user": { … } }`. |
| `POST` | `/api/logout` | Sim | — | **200** — revoga o token atual; corpo típico `{ "message": "OK" }`. |

Erros de validação seguem o formato Laravel (**422** com `message` e `errors` por campo).

### Clientes (`ClientRequest`)

Todas as rotas abaixo exigem **`Authorization: Bearer <token>`**.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/clientes` | Lista **paginada** (`?page=`, opcional `per_page` até 100). JSON no formato padrão do paginator Laravel (`data`, `current_page`, …). |
| `POST` | `/api/clientes` | Cria registo. Corpo: `nome`, `email`, `telefone`, `cep`, `rua`, `bairro`, `cidade`, `estado` (UF, 2 caracteres). |
| `GET` | `/api/clientes/{id}` | Detalhe de um cliente (`id` numérico da tabela `clientes`). |
| `PUT` ou `PATCH` | `/api/clientes/{id}` | Atualização (mesmos campos do `POST`). |
| `DELETE` | `/api/clientes/{id}` | Remove o cliente. **204** sem corpo em sucesso. |

Definição das rotas: [`app/routes/api.php`](./app/routes/api.php). Controladores: `App\Http\Controllers\Api\AuthController` e `App\Http\Controllers\Api\ClientController`.

---

## Ambiente Docker (visão geral)

Os serviços **`laravel`** e **`db`** ficam na rede interna do Compose; o Laravel usa o hostname **`db`** para o MySQL.

```mermaid
flowchart LR
  subgraph compose["Docker Compose (projeto testeseabre)"]
    L["laravel\n(testeseabre-laravel)\nphp artisan serve :8000"]
    D[("db — MySQL 8\n(testeseabre-db)")]
  end
  Browser(["Navegador\nlocalhost:APP_PORT"]) --> L
  L --> D
```

| Serviço (Compose) | Container | Função |
|-------------------|-----------|--------|
| **laravel** | `testeseabre-laravel` | Build `app/Dockerfile`, volume `./app`, expõe **8000** (ou `APP_PORT`). |
| **db** | `testeseabre-db` | MySQL 8, volume persistente `mysql_data`. |

---

## Variáveis de ambiente

Três contextos: **raiz** (Compose), **`app/`** (Laravel) e opcionalmente **`frontend/`** (Vite).

### Raiz do repositório (`/.env`)

Opcional; copie de [`.env.example`](./.env.example). Afeta principalmente portas e credenciais injetadas no Compose.

| Variável | Descrição |
|----------|-----------|
| `APP_PORT` | Porta publicada da aplicação (padrão **8000**). |
| `APP_ENV` / `APP_DEBUG` | Ambiente e modo debug no container. |
| `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | Banco MySQL usado pelo serviço **db** e referenciado pelo Laravel no Docker. |
| `MYSQL_ROOT_PASSWORD` | Senha do root do MySQL. |
| `FORWARD_DB_PORT` | Porta do MySQL no host (padrão **3306**). |

### Pasta `app/` (`app/.env`)

Copie de [`app/.env.example`](./app/.env.example). No **Docker**, parte desses valores é sobrescrita pelo ambiente do Compose (`DB_*`, `APP_URL`, etc.).

| Variável | Descrição |
|----------|-----------|
| `APP_KEY` | Chave da aplicação (obrigatória; `php artisan key:generate`). |
| `APP_URL` | URL base; deve coincidir com o que você abre no navegador (ex.: `http://localhost:8000`). |
| `DB_*` | Conexão: no Docker costuma ser **mysql** e host **`db`**. |
| `SESSION_DRIVER` | Ex.: `database` (exige tabela `sessions`). |
| `SESSION_SECURE_COOKIE` | Em **HTTP** local, use **`false`** para evitar erro **419** (sessão/CSRF). |
| `CACHE_STORE` / `QUEUE_CONNECTION` | Padrão `database` no exemplo (exige migrations de cache/jobs). |

### Pasta `frontend/` (`frontend/.env`)

Opcional; ver secção [Frontend React](#frontend-react). O ficheiro não é usado pelo Docker Compose.

---

## Infraestrutura: Laravel, Dockerfile e Compose

### Projeto Laravel

Criado na pasta `app/` com Composer (`composer create-project laravel/laravel app`). **Laravel 12**, PHP compatível **^8.2**; em Docker a imagem usa **PHP 8.3 CLI**.

### Dockerfile (`app/Dockerfile`)

Imagem **PHP 8.3 CLI** (`php:8.3-cli-bookworm`) com extensões **pdo_mysql**, **mbstring**, **pcntl**, **bcmath**, **zip**, **intl**, **Git**, **Unzip**, **Composer 2** e entrypoint `docker-entrypoint.sh` (dependências, `APP_KEY`, migrações, `php artisan serve`).

O arquivo `app/.dockerignore` reduz o contexto de build.

> **Comandos Artisan dentro do container** (com os serviços no ar, na pasta da raiz do repositório):
>
> ```bash
> docker compose exec laravel php artisan migrate
> ```
>
> Ou pelo nome do container:
>
> ```bash
> docker exec testeseabre-laravel php artisan migrate
> ```

---

## Autenticação com Laravel Breeze

Pacote **[Laravel Breeze](https://laravel.com/docs/starter-kits#laravel-breeze)** (Blade + Vite): login, registro, logout, recuperação de senha e verificação de e-mail.

Instalação de referência (já aplicada no projeto):

```bash
composer require laravel/breeze --dev
php artisan breeze:install blade
npm install && npm run build
```

A tabela **`users`** segue a migration padrão. Após clonar, execute **`php artisan migrate`** com o banco vazio.

**Rotas:** `/dashboard` usa `middleware(['auth', 'verified'])`; o **CRUD de clientes** (`Route::resource('clientes', ClientController::class)`) está no mesmo grupo em `routes/web.php`.

A **API JSON** para o React está em `routes/api.php` (`App\Http\Controllers\Api\…`), com as mesmas regras de validação (`ClientRequest`) no recurso de clientes.

---

## Modelagem da tabela `clientes` e CRUD

Migration `database/migrations/2026_05_09_200548_create_clientes_table.php` — tabela **`clientes`**:

| Campo | Observação |
|-------|------------|
| `nome` | string |
| `email` | string, **único** |
| `telefone` | string (32) |
| `cep` | string (9) |
| `rua`, `bairro`, `cidade` | string |
| `estado` | string (2), UF |
| `created_at` / `updated_at` | timestamps |

**CRUD (resumo):**

| Peça | Caminho |
|------|---------|
| Controller resource | `app/Http/Controllers/ClientController.php` |
| Validação | `app/Http/Requests/ClientRequest.php` |
| Views | `resources/views/clients/` (`index`, `create`, `edit`, `show`, `_form`) |
| Rotas | `Route::resource('clientes', …)` com `auth` + `verified` |
| API (React) | `Route::apiResource('clientes', Api\ClientController::class)` com `auth:sanctum` em `routes/api.php` |

Exclusão com confirmação via `data-confirm` e script em `resources/views/layouts/app.blade.php` (Blade). No React, a exclusão usa `confirm()` do navegador antes de `DELETE /api/clientes/{id}`.

---

## Busca de CEP (ViaCEP)

O formulário (`resources/views/clients/_form.blade.php`) consulta o CEP no **blur** do campo, via **[ViaCEP](https://viacep.com.br/)** (`GET https://viacep.com.br/ws/{cep}/json/`), preenchendo **rua**, **bairro**, **cidade** e **estado** a partir de `logradouro`, `bairro`, `localidade` e `uf`.

<details>
<summary><strong>Nota — API oficial dos Correios</strong></summary>

Não há integração com a API institucional dos Correios (**CWS**/contrato/homologação) neste momento. Foi aberto chamado no suporte; prazo informado de **até 5 dias úteis** para retorno. Até lá a ViaCEP cobre o requisito de endereço automático no ambiente de desenvolvimento.

**Comprovante de contato:**

</details>
<img width="1600" height="801" alt="image" src="https://github.com/user-attachments/assets/898d3cca-ca55-442b-8dfe-dea2b620601f" />

---

## Interface

### Blade (Laravel Breeze)

Capturas abaixo referem-se às telas **servidas pelo Laravel** (`resources/views/…`).

<img width="1880" height="947" alt="image" src="https://github.com/user-attachments/assets/a52ede5f-364f-4d74-9b47-481f04fafc4b" />
<img width="1841" height="685" alt="image" src="https://github.com/user-attachments/assets/b8414e27-eb38-4613-867f-aee411f85b96" />
<img width="1879" height="942" alt="image" src="https://github.com/user-attachments/assets/274f0cf3-bf16-46fc-af31-9114bce4073f" />

### React (`frontend/`)

Interface alternativa em SPA: login, lista e formulários consomem **`/api`** (Sanctum). Para visualizar, siga a secção [Frontend React](#frontend-react).
<img width="1877" height="945" alt="image" src="https://github.com/user-attachments/assets/057848ce-3cb3-475b-bcc4-2a1a3def6451" />
<img width="1872" height="947" alt="image" src="https://github.com/user-attachments/assets/ddff2299-98f7-4e21-9257-e74ff5a063e7" />
<img width="1876" height="948" alt="image" src="https://github.com/user-attachments/assets/ba817660-e04a-4182-865d-ae0c17233837" />
<img width="1870" height="949" alt="image" src="https://github.com/user-attachments/assets/14ede678-3014-4fa1-ac62-4385c76df67c" />


---

## Desenvolvimento local sem Docker

Na pasta `app/`: copie `.env.example` para `.env`, configure o banco (ex.: SQLite) e:

```bash
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

Em outro terminal, na pasta `frontend/`: `npm install` e `npm run dev` (Laravel em `http://127.0.0.1:8000` alinhado ao proxy do Vite).

---

## Estrutura do repositório

```text
.
├── docker-compose.yml
├── .env.example              # variáveis opcionais para o Compose (raiz)
├── README.md
├── frontend/                 # SPA React (Vite, TypeScript, Tailwind)
│   ├── package.json
│   ├── .env.example
│   ├── src/
│   │   ├── api/              # cliente HTTP, auth, clientes
│   │   ├── pages/
│   │   ├── index.css         # tokens e classes ui-*
│   │   └── …
│   └── …
└── app/                      # projeto Laravel
    ├── Dockerfile
    ├── docker-entrypoint.sh
    ├── .env.example          # Laravel
    └── …                     # app/, resources/, routes/, …
```

---

