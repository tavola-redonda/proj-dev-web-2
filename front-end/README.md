# 🍗 Casa do Frango - Sistema de Delivery Web (SPA)

Projeto acadêmico para o curso de Sistemas de Informação. Este repositório reflete a modernização da Fase 2 do projeto, onde a arquitetura MVC clássica (JSP) foi refatorada para uma **Single Page Application (SPA) em React**, operando de forma totalmente desacoplada de uma **API RESTful em Java Servlets**.

🔗 **Acesso ao Front-end (GitHub Pages):** [Coloque o link do GitHub Pages aqui]

---

## ✅ Atendimento aos Requisitos (Pull Requests)

O projeto foi organizado e versionado utilizando o fluxo de Pull Requests para garantir o atendimento aos objetivos da disciplina:

* **[PR] Alteração da resposta do Servlet para JSON:** O Back-end foi reescrito para atuar exclusivamente como API. O `RequestDispatcher.forward()` foi removido e todas as rotas (Login, Cardápio, Carrinho, Checkout) agora respondem em payloads JSON estruturados.
* **[PR] Alteração de JSP para React:** As antigas *Views* foram substituídas por uma interface dinâmica e rápida utilizando React e Vite.
* **[PR] Modularização e Componentes Reutilizáveis:** O Front-end foi estruturado em componentes independentes (ex: `ProductCard`, `CategoryTabs`, `GlobalAlerts`, `AppHeader`), eliminando redundância visual e facilitando a manutenção.
* **[PR] Comunicação Assíncrona (Fetch API) e Estado:** Implementação de uma camada de serviço (`api.js`) com suporte a Promises e `async/await`. O projeto gerencia o estado (State) localmente para evitar reloads de página, além de garantir a sincronia da sessão via cookies (`credentials: 'include'`).
* **[PR] Testes de API (Bruno):** A documentação e os testes de todas as rotas GET e POST da API Java foram realizados utilizando o [Bruno](https://www.usebruno.com/). A Collection exportada encontra-se na pasta raiz deste repositório (`/bruno-collection` ou arquivo `.json`).
* **[PR] Hospedagem e Deploy:** Pipeline automatizado pelo GitHub Pages para o Front-end estático.

---

## 🛠️ Como Executar a API Java (Back-end)

A arquitetura manteve o suporte nativo ao Docker desenvolvido na Fase 1, permitindo rodar a API de forma imediata sem necessidade de instalar o Tomcat ou MySQL na máquina hospedeira.

**1. Subir a infraestrutura (Docker)**

Na raiz do diretório do Back-end, execute:
```bash
docker compose up --build
```

**2. Credenciais Padrão do Banco (setup.sql)**

O banco já subirá provisionado com os seguintes dados:

    E-mail: admin@local
    Senha: 123

Para encerrar os contêineres e limpar o volume, utilize:
```bash
docker compose down -v
```
(Alternativamente, é possível importar o projeto diretamente em uma IDE e configurar o Tomcat integrado com as credenciais do MySQL definidas no .env e utilizando o script ./run.sh).
💻 Como Executar o React (Front-end)

Com a API rodando no Docker (porta 8080), inicie o Front-end separadamente:

1. Navegue até a pasta do cliente React:
```bash
cd front-react
```

2. Instale as dependências:
```bash
npm install
```
3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
Acesse o painel pelo navegador em http://localhost:5173. O React está configurado para consumir os dados dinamicamente do Tomcat de forma assíncrona.

👥 Equipe de Desenvolvimento

O sistema foi refatorado de forma colaborativa pelos alunos:

    *Caio Bastos

    *Caio Nascimento

    *Gabriel Parrini

    *Luiz Gabriel

    *Vinicius Fonseca 