# CRUD de clientes — Laravel

Aplicação em PHP/Laravel para cadastro de clientes (teste técnico), com ambiente containerizado.

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ou Docker Engine + Docker Compose v2)
- Opcional (desenvolvimento fora do Docker): PHP ^8.2 e [Composer](https://getcomposer.org/)

---

## O que já está configurado (Fase 1 — infraestrutura)

### 1. Projeto Laravel

Foi criado o projeto na pasta `app/` com Composer:

```bash
composer create-project laravel/laravel app
```

Versão utilizada: **Laravel 12** (compatível com PHP ^8.2). O código da API e as rotas ficam em `app/`, conforme o padrão MVC do framework.

### 2. Dockerfile da aplicação

O arquivo `app/Dockerfile` define uma imagem **PHP 8.3 CLI** (`php:8.3-cli-bookworm`) com:

- Extensões compiladas: **pdo_mysql**, **mbstring**, **pcntl**, **bcmath**, **zip**, **intl**
- Ferramentas: **Git**, **Unzip**, **Composer 2**
- Script de entrada `docker-entrypoint.sh`: instala dependências com Composer, gera `APP_KEY` se necessário, executa migrações e sobe o servidor embutido do Laravel

O arquivo `app/.dockerignore` reduz o contexto de build (ignora `vendor/`, `node_modules/`, `.env`, etc.).

### 3. Docker Compose (`docker-compose.yml`)

Na raiz do repositório, o Compose sobe dois serviços:

| Serviço | Descrição |
|--------|-----------|
| **laravel** | Build a partir de `app/Dockerfile`, monta o código em `./app`, expõe a aplicação na porta configurável (padrão **8000**). Usa **`php artisan serve`**. Container: **`testeseabre-laravel`**. |
| **db** | **MySQL 8.0** com volume `mysql_data`. Container: **`testeseabre-db`**. |

O projeto Compose chama-se **`testeseabre`** (`name:` no arquivo), então a imagem da aplicação aparece como **`testeseabre-laravel`** no Docker Desktop.

**Comandos Artisan no container** (na pasta do repositório, com os containers no ar):

```bash
docker compose exec laravel php artisan migrate
```

Ou pelo nome do container:

```bash
docker exec testeseabre-laravel php artisan migrate
```

Variáveis de ambiente da aplicação apontam o Laravel para o host **`db`** na rede interna do Compose (`DB_CONNECTION=mysql`, etc.). Opcionalmente você pode criar um arquivo `.env` **na raiz** (veja `.env.example`) para ajustar portas e credenciais do MySQL sem editar o `docker-compose.yml`.

---

## Fase 2 — Autenticação (Laravel Breeze)

Foi adicionado o pacote oficial **[Laravel Breeze](https://laravel.com/docs/starter-kits#laravel-breeze)** (stack **Blade** + Vite), que fornece telas e fluxos de **login**, **registro**, **logout**, recuperação de senha e verificação de e-mail.

Instalação (na pasta `app/`):

```bash
composer require laravel/breeze --dev
php artisan breeze:install blade
npm install && npm run build
```

O comando `breeze:install` só existe **depois** do `composer require`; no projeto isso já está aplicado.

**Usuários (`users`):** a tabela segue a migration padrão do Laravel (`database/migrations/0001_01_01_000000_create_users_table.php`), com `name`, `email`, `password`, `remember_token`, etc. Rode **`php artisan migrate`** após clonar ou quando o banco estiver vazio.

**Rotas já protegidas pelo Breeze:** `/dashboard` usa `middleware(['auth', 'verified'])`; rotas de **perfil** ficam em grupo com `middleware('auth')`. Visitantes não autenticados são redirecionados para o login.

**Pendente (quando existir o CRUD):** as rotas de **clientes** precisam ser registradas com `middleware('auth')` (ou grupo equivalente). O Breeze **não** protege automaticamente rotas novas — ver `TASKS.md`.

---

## Fase 3 — Tabela `clientes` (migration)

Existe a migration `database/migrations/2026_05_09_200548_create_clientes_table.php`, que cria a tabela **`clientes`** com:

| Campo       | Observação        |
|------------|-------------------|
| `nome`     | string            |
| `email`    | string, **único** |
| `telefone` | string (32)       |
| `cep`      | string (9)        |
| `rua`      | string            |
| `bairro`   | string            |
| `cidade`   | string            |
| `estado`   | string (2), ex.: UF |
| `created_at` / `updated_at` | timestamps |

Para aplicar no banco (pasta `app/`):

```bash
php artisan migrate
```

No Docker (com containers no ar):

```bash
docker compose exec laravel php artisan migrate
```

O **Model** `Client` (`app/Models/Client.php`, tabela **`clientes`**) e o CRUD nas rotas/views entram nas próximas fases — ver `TASKS.md`.

---

## Busca de CEP (ViaCEP)

O formulário de clientes (`resources/views/clients/_form.blade.php`) consulta o CEP ao **sair do campo** (`blur`), usando a API pública **[ViaCEP](https://viacep.com.br/)** (`GET https://viacep.com.br/ws/{cep}/json/`). Os campos **rua**, **bairro**, **cidade** e **estado** são preenchidos com `logradouro`, `bairro`, `localidade` e `uf`.

A API oficial dos Correios exige **contrato comercial**, token no **CWS** etc.; para este projeto optou-se pela **ViaCEP**, solução usual em desenvolvimento e compatível com o objetivo da prova (endereço automático a partir do CEP).

---

## Como executar com Docker

Na raiz do repositório (onde está o `docker-compose.yml`):

1. (Opcional) Copie o exemplo de variáveis da raiz e ajuste se precisar:

   ```bash
   copy .env.example .env
   ```

   No Linux/macOS: `cp .env.example .env`

2. Suba os containers:

   ```bash
   docker compose up --build
   ```

3. Acesse no navegador: **http://localhost:8000** (ou a porta definida em `APP_PORT` no `.env` da raiz).

Na primeira subida, o entrypoint pode rodar `composer install`, gerar chave da aplicação e `php artisan migrate` contra o MySQL.

Para rodar em segundo plano:

```bash
docker compose up --build -d
```

Parar e remover containers (o volume do MySQL é mantido):

```bash
docker compose down
```

Para apagar também os dados do banco:

```bash
docker compose down -v
```

---

## Desenvolvimento local sem Docker (opcional)

Entre na pasta `app/`, copie `.env.example` para `.env`, configure o banco (por exemplo SQLite, já previsto no `.env.example`) e execute:

```bash
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

---

## Estrutura relevante

```text
.
├── docker-compose.yml      # app + MySQL
├── .env.example            # variáveis opcionais para o Compose (raiz)
├── README.md
└── app/
    ├── Dockerfile
    ├── docker-entrypoint.sh
    ├── .dockerignore
    └── ...                  # projeto Laravel
```

---

## Próximos passos (conforme `TASKS.md`)

- Revisão final do README e instruções de entrega no GitHub (repositório público).
