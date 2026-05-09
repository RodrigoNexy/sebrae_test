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
| **app** | Build a partir de `app/Dockerfile`, monta o código em `./app`, expõe a aplicação na porta configurável (padrão **8000**). Usa **`php artisan serve`** (não é obrigatório Nginx para este fluxo). |
| **db** | **MySQL 8.0** com volume nomeado `mysql_data` para persistir dados. |

Variáveis de ambiente da aplicação apontam o Laravel para o host **`db`** na rede interna do Compose (`DB_CONNECTION=mysql`, etc.). Opcionalmente você pode criar um arquivo `.env` **na raiz** (veja `.env.example`) para ajustar portas e credenciais do MySQL sem editar o `docker-compose.yml`.

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

Entre na pasta `app/`, copie `env.example` para `.env`, configure o banco (por exemplo SQLite, já previsto no `.env.example`) e execute:

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

Autenticação, CRUD de clientes, integração de CEP e documentação final de entrega serão acrescentados nas fases seguintes.
