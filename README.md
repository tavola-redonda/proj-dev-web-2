# Tavola Redonda - Sistema de Delivery

Sistema web de delivery de comida com arquitetura desacoplada: **React** (front-end) + **Java Servlets** (back-end API REST).

## Arquitetura

```
┌─────────────┐     HTTP/JSON     ┌─────────────┐     JDBC     ┌─────────┐
│  React SPA  │ ◄───────────────► │  Servlets   │ ◄──────────► │  MySQL  │
│  (Vite)     │   Fetch API       │  (Tomcat)   │              │  8.0    │
│  :5173      │                   │  :8080      │              │  :3306  │
└─────────────┘                   └─────────────┘              └─────────┘
```

- **Front-end:** React 19, Vite 8, comunicacao assincrona via Fetch API
- **Back-end:** Java Servlets (Jakarta EE), Tomcat 10.1, API REST retornando JSON
- **Banco:** MySQL 8.0, 4 tabelas (usuarios, itens_cardapio, pedidos, pedido_itens)

## Como rodar localmente (Docker)

### Pre-requisitos
- Docker e Docker Compose instalados
- Git

### Passos

```bash
# 1. Clonar o repositorio
git clone git@github.com:tavola-redonda/proj-dev-web-2.git
cd proj-dev-web-2

# 2. Subir todos os servicos
sudo docker compose up --build

# 3. Acessar
# Front-end: http://localhost:5173
# Back-end:  http://localhost:8080/proj_dev_web
```

### Parar os servicos

```bash
sudo docker compose down
```

Para limpar o volume do banco (resetar dados):

```bash
sudo docker compose down -v
```

## Como rodar a API Java isoladamente

Se quiser rodar apenas o back-end sem o front-end React:

```bash
cd back-end
sudo docker compose up --build
```

A API estara disponivel em `http://localhost:8080/proj_dev_web`.

### Endpoints da API

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/login` | Verificar sessao ativa |
| POST | `/login` | Autenticar usuario |
| POST | `/logout` | Encerrar sessao |
| POST | `/cadastro` | Registrar novo usuario |
| GET | `/cardapio` | Listar itens do cardapio |
| POST | `/cardapio` | Adicionar item ao carrinho |
| GET | `/Carrinho` | Ver carrinho |
| POST | `/Carrinho` | Adicionar/remover quantidade (acao=add/remove) |
| POST | `/checkout` | Finalizar pedido |
| GET | `/perfil` | Ver perfil do usuario |
| POST | `/perfil` | Atualizar perfil |
| GET | `/historico-pedidos` | Listar pedidos anteriores |

### Credenciais padrao

- **Admin:** email `admin@local`, senha `123`

## Testes de API com Bruno

A collection de testes da API esta em `back-end/bruno/`.

1. Instale o [Bruno](https://www.usebruno.com/)
2. Abra o Bruno e importe a pasta `back-end/bruno/`
3. Selecione o environment **local**
4. Certifique-se de que os containers estao rodando (`sudo docker compose up`)
5. Execute os requests na ordem:
   - **Login** primeiro (para criar a sessao)
   - Depois os demais endpoints que exigem autenticacao

## Front-end hospedado

O front-end esta publicado no GitHub Pages:

**https://tavola-redonda.github.io/proj-dev-web-2/**

> Nota: o GitHub Pages hospeda apenas o front-end estatico. Para funcionalidade completa (login, carrinho, pedidos), a API precisa estar rodando localmente via Docker.

## Estrutura do repositorio

```
proj-dev-web-2/
├── front-end/               # React SPA
│   ├── src/
│   │   ├── components/      # Componentes reutilizaveis (Header, Footer, ProductCard...)
│   │   ├── pages/           # Paginas (Login, Cardapio, Carrinho, Checkout...)
│   │   ├── api.js           # Camada de comunicacao com a API
│   │   ├── App.jsx          # Componente principal + gerenciamento de estado
│   │   └── main.jsx         # Entry point
│   ├── Dockerfile
│   └── package.json
├── back-end/                # API REST Java
│   ├── src/main/java/
│   │   ├── controller/      # Servlets (endpoints da API)
│   │   ├── dao/             # Data Access Objects
│   │   ├── model/           # Entidades
│   │   └── util/            # Utilitarios (hash de senha)
│   ├── bruno/               # Collection Bruno para testes
│   ├── setup.sql            # Script de inicializacao do banco
│   └── Dockerfile
├── docker-compose.yml       # Orquestracao: db + back-end + front-end
├── .github/workflows/       # GitHub Actions (deploy do front-end)
└── README.md
```

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Front-end | React 19, Vite 8, CSS3 (responsivo) |
| Back-end | Java 17, Jakarta Servlets, Tomcat 10.1, Gson |
| Banco | MySQL 8.0 |
| Infra | Docker, Docker Compose, GitHub Actions, GitHub Pages |
| Testes | Bruno (API testing) |
| Seguranca | PBKDF2 (hash de senhas), sessoes HttpSession |
