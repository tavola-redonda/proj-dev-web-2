<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="model.User" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Casa do Frango</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <%
        User usuarioLogado = (User) session.getAttribute("usuarioLogado");
        String nomeUsuario = usuarioLogado != null ? usuarioLogado.getNome() : null;
    %>
    <div class="page home-page">
        <header class="topbar">
            <div class="brand">Casa do Frango</div>
            <div class="nav-actions">
                <% if (nomeUsuario != null) { %>
                    <div class="user-chip">
                        <span>Pedido de</span>
                        <strong><%= nomeUsuario %></strong>
                    </div>
                    <a class="button secondary" href="perfil">Perfil</a>
                    <a class="button ghost" href="historico-pedidos">Pedidos</a>
                    <a class="button ghost" href="Carrinho">Carrinho</a>
                    <a class="button secondary" href="logout">Sair</a>
                <% } else { %>
                    <a class="button secondary" href="login.jsp">Login</a>
                    <a class="button ghost" href="cadastro">Sign in</a>
                <% } %>
            </div>
        </header>

        <main class="home-stage">
            <section class="hero home-hero fade-in">
                <div>
                    <h1>Bem-vindo a sua mesa digital</h1>
                    <p>Escolha pratos frescos, monte seu pedido e finalize com poucos cliques.</p>
                    <div class="nav-actions" style="margin-top: 16px;">
                        <a class="button" href="cardapio">Fazer pedido</a>
                        <% if (nomeUsuario == null) { %>
                            <a class="button secondary" href="login.jsp">Login</a>
                            <a class="button ghost" href="cadastro">Sign in</a>
                        <% } else { %>
                            <a class="button secondary" href="perfil">Perfil</a>
                            <a class="button ghost" href="historico-pedidos">Pedidos</a>
                        <% } %>
                    </div>
                </div>
                <div>
                    <span class="badge">Pedidos rapidos</span>
                    <span class="badge" style="margin-left: 8px;">Entrega simples</span>
                </div>
            </section>
        </main>
    </div>
</body>
</html>