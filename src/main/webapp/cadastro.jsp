<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Criar conta - Casa do Frango</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <%
        String erro = (String) request.getAttribute("erro");
        String nome = (String) request.getAttribute("nome");
        String telefone = (String) request.getAttribute("telefone");
        String email = (String) request.getAttribute("email");
        String endereco = (String) request.getAttribute("endereco");
    %>
    <div class="page">
        <header class="topbar">
            <div class="brand">Casa do Frango</div>
            <div class="nav-actions">
                <a class="button secondary" href="login.jsp">Login</a>
                <a class="button ghost" href="index.jsp">Inicio</a>
            </div>
        </header>

        <section class="hero auth-hero fade-in">
            <div>
                <span class="badge">Novo cadastro</span>
                <h1>Crie sua conta</h1>
                <p>Preencha seus dados para acessar o cardapio e fazer pedidos.</p>
            </div>
            <div class="form-card">
                <h2>Cadastro</h2>
                <% if (erro != null) { %>
                    <div class="error"><%= erro %></div>
                <% } %>
                <form action="cadastro" method="post">
                    <div class="field">
                        <label for="nome">Nome</label>
                        <input id="nome" type="text" name="nome" value="<%= nome == null ? "" : nome %>" required>
                    </div>
                    <div class="form-grid">
                        <div class="field">
                            <label for="email">Email</label>
                            <input id="email" type="email" name="email" value="<%= email == null ? "" : email %>" required>
                        </div>
                        <div class="field">
                            <label for="telefone">Telefone</label>
                            <input id="telefone" type="text" name="telefone" value="<%= telefone == null ? "" : telefone %>">
                        </div>
                    </div>
                    <div class="field">
                        <label for="endereco">Endereco</label>
                        <input id="endereco" type="text" name="endereco" value="<%= endereco == null ? "" : endereco %>">
                    </div>
                    <div class="form-grid">
                        <div class="field">
                            <label for="senha">Senha</label>
                            <input id="senha" type="password" name="senha" required>
                        </div>
                        <div class="field">
                            <label for="confirmarSenha">Confirmar senha</label>
                            <input id="confirmarSenha" type="password" name="confirmarSenha" required>
                        </div>
                    </div>
                    <button class="button" type="submit">Criar conta</button>
                </form>
            </div>
        </section>
    </div>
</body>
</html>