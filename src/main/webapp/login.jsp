<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <title>Login - Casa do Frango</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <%
        String mensagemSucesso = "ok".equals(request.getParameter("cadastro"))
                ? "Usuario criado com sucesso. Agora faca login."
                : null;
        String mensagemErro = (String) request.getAttribute("erro");
        String emailPreenchido = request.getParameter("email") != null ? request.getParameter("email") : "";
    %>
    <div class="page">
        <header class="topbar">
            <div class="brand">Casa do Frango</div>
            <div class="nav-actions">
                <a class="button ghost" href="cadastro">Sign in</a>
                <a class="button secondary" href="index.jsp">Inicio</a>
            </div>
        </header>

        <section class="hero auth-hero fade-in">
            <div>
                <span class="badge">Acesso seguro</span>
                <h1>Identifique-se</h1>
                <p>Entre para ver o cardapio e montar seu pedido.</p>
            </div>
            <div class="form-card">
                <h2>Login</h2>
                <% if (mensagemSucesso != null) { %>
                    <div class="success"><%= mensagemSucesso %></div>
                <% } %>
                <% if (mensagemErro != null) { %>
                    <div class="error"><%= mensagemErro %></div>
                <% } %>
                <form action="login" method="post">
                    <div class="field">
                        <label for="email">Email</label>
                        <input id="email" type="email" name="email" value="<%= emailPreenchido %>" required>
                    </div>
                    <div class="field">
                        <label for="senha">Senha</label>
                        <input id="senha" type="password" name="senha" required>
                    </div>
                    <button class="button" type="submit">Entrar</button>
                </form>
                <p class="helper" style="margin-top: 16px;">Ainda nao tem conta? <a href="cadastro">Sign in</a>.</p>
            </div>
        </section>
    </div>
</body>
</html>