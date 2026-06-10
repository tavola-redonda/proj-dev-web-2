# proj_dev_web
Projeto acadêmico desenvolvido para a disciplina de Desenvolvimento Web. Trata-se de um e-commerce focado na venda de produtos, construído sob a arquitetura clássica MVC (Model-View-Controller) utilizando Java puro.

### Tecnologias Utilizadas
* **Backend:** Java, Servlets, JSP
* **Servidor:** Apache Tomcat 10.1
* **Banco de Dados:** MySQL
* **Padrões:** MVC, DAO, Cache HTTP

---

# Rodar com Docker

Este é o caminho recomendado. Você não precisa instalar Tomcat, MySQL nem JDK na máquina. Basta ter Docker e Docker Compose.

### 1. Subir tudo

Na raiz do projeto, execute:

```bash
docker compose up --build
```

### 2. Acessar a aplicação

Depois que os containers subirem, abra:

```text
http://localhost:8080/proj_dev_web/
```

### 3. Credenciais iniciais

O banco sobe com os dados do arquivo [setup.sql](setup.sql):

* email: `admin@local`
* senha: `123`

### 4. Parar e limpar

Para parar os containers:

```bash
docker compose down
```

Para parar e remover o volume do banco:

```bash
docker compose down -v
```

---

## Mapeamento de Rotas e Segurança

O roteamento do sistema foi centralizado para direcionar o fluxo entre as requisições do navegador e as regras de negócio de forma segura:

*  **Autenticação (`/login`)**
  * **Servlet:** `LoginServlet` | **View:** `login.jsp` ou `index.jsp`
  * Valida as credenciais do usuário e gerencia a criação da sessão.
*  **Encerramento (`/logout`)**
  * **Servlet:** `LogoutServlet` | **View:** `login.jsp`
  * Invalida a sessão atual de forma segura e redireciona para o login.
*  **Vitrine de Produtos (`/cardapio` ou `/main`)**
  * **Servlet:** `ItemCardapioController` | **View:** `cardapio.jsp`
  * Carrega os produtos do banco, exibe a vitrine e implementa cabeçalhos de **Cache HTTP** para otimização.
*  **Carrinho de Compras (`/Carrinho`)**
  * **Servlet:** `CarrinhoController` | **View:** `carrinho.jsp`
  * Gerencia o estado do carrinho na sessão (adição, remoção e cálculo de subtotais).
*  **Tratamento de Erros (`404` / `500`)**
  * **Configuração:** `web.xml` | **Views:** `404.jsp` / `500.jsp`
  * Captura de rotas inexistentes (404) e quebras internas de servidor (500), garantindo a continuidade da navegação.

---

# Como Rodar sem Docker

> **Nota para usuários Windows:** A abordagem recomendada é importar o projeto diretamente em uma IDE (como o **Eclipse**) e configurar o servidor Tomcat integrado.

As instruções abaixo são otimizadas para ambientes **Linux/WSL**. É necessário ter o **Java JDK** e o **MySQL** instalados na máquina.

### 1. Descompactar o Servidor
Descompacte o arquivo `.zip` do Tomcat dentro do diretório `apps/`:
```bash 
cd apps 
unzip apache-tomcat-10.1.54.zip

### 2) Configurar o TOMCAT_HOME

Edite o arquivo [.env](.env) e aponte para a pasta descompactada no seu ambiente Linux/WSL:

```bash
TOMCAT_HOME=/home/seu-usuario/projects/proj_dev_web/apps/apache-tomcat-10.1.54
```

Se você mantiver o arquivo `apps/apache-tomcat-10.1.54.zip`, o script `run.sh` tenta descompactar e usar essa distribuição automaticamente.

### 3) Configurar o banco

O script usa o arquivo [setup.sql](setup.sql) para criar automaticamente o banco, o usuário da aplicação e as tabelas necessárias.
Você pode ajustar as credenciais em [.env](.env):

```bash
DB_URL=jdbc:mysql://127.0.0.1:3306/dbteste?useTimezone=true&serverTimezone=UTC
DB_USER=app
DB_PASS=app123
```

Usuário default do sistema:

- email: admin@local
- senha: 123

### 4) Compilar, empacotar e subir

Com tudo configurado, utilize o script [run.sh](run.sh). Ele executará o setup do MySQL usando `sudo`:

```bash
./run.sh
```

O Tomcat iniciará em foreground. Para acessar o sistema pelo navegador, acesse a URL:

```
http://localhost:8080/proj_dev_web/
```
