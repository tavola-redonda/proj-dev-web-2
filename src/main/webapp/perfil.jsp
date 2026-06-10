<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="model.User" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Perfil - Casa do Frango</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <%
        User usuarioLogado = (User) session.getAttribute("usuarioLogado");
        String nomeUsuario = usuarioLogado != null ? usuarioLogado.getNome() : "";
        String emailUsuario = usuarioLogado != null ? usuarioLogado.getEmail() : "";
        String telefoneUsuario = usuarioLogado != null ? usuarioLogado.getTelefone() : "";
        String enderecoUsuario = usuarioLogado != null ? usuarioLogado.getEndereco() : "";
        String sucessoPerfil = "1".equals(request.getParameter("ok")) ? "Perfil atualizado com sucesso." : null;
        String erroPerfil = (String) request.getAttribute("erro");
        String nomeFormulario = request.getAttribute("nome") != null ? (String) request.getAttribute("nome") : nomeUsuario;
        String enderecoFormulario = request.getAttribute("endereco") != null ? (String) request.getAttribute("endereco") : enderecoUsuario;
    %>
    <div class="page">
        <header class="topbar">
            <div class="brand">Casa do Frango</div>
            <div class="nav-actions nav-actions-spread">
                <% if (usuarioLogado != null) { %>
                    <div class="user-chip">
                        <span>Pedido de</span>
                        <strong><%= nomeUsuario %></strong>
                    </div>
                    <a class="button secondary" href="historico-pedidos">Pedidos</a>
                    <a class="button ghost" href="Carrinho">Carrinho</a>
                    <a class="button secondary" href="logout">Sair</a>
                <% } %>
                <a class="button secondary" href="cardapio">Cardapio</a>
                <a class="button ghost" href="index.jsp">Inicio</a>
            </div>
        </header>

        <section class="hero auth-hero fade-in">
            <div>
                <span class="badge">Perfil</span>
                <h1>Seus dados da conta</h1>
                <p>Veja suas informacoes e altere nome ou endereco sempre que precisar.</p>
                <% if (sucessoPerfil != null) { %>
                    <div class="success" style="margin-top: 16px;"><%= sucessoPerfil %></div>
                <% } %>
                <% if (erroPerfil != null) { %>
                    <div class="error" style="margin-top: 16px;"><%= erroPerfil %></div>
                <% } %>
            </div>
            <div class="profile-layout" style="margin-top: 0;">
                <div class="panel">
                    <h2>Dados atuais</h2>
                    <div class="profile-meta">
                        <div class="meta-row">
                            <span>Nome</span>
                            <strong><%= nomeUsuario %></strong>
                        </div>
                        <div class="meta-row">
                            <span>Email</span>
                            <strong><%= emailUsuario %></strong>
                        </div>
                        <div class="meta-row">
                            <span>Telefone</span>
                            <strong><%= telefoneUsuario == null || telefoneUsuario.isBlank() ? "Nao informado" : telefoneUsuario %></strong>
                        </div>
                        <div class="meta-row">
                            <span>Endereco</span>
                            <strong><%= enderecoUsuario == null || enderecoUsuario.isBlank() ? "Nao informado" : enderecoUsuario %></strong>
                        </div>
                    </div>
                </div>

                <div class="panel">
                    <h2>Editar perfil</h2>
                    <form action="perfil" method="post">
                        <div class="field">
                            <label for="nome">Nome</label>
                            <input id="nome" type="text" name="nome" value="<%= nomeFormulario == null ? "" : nomeFormulario %>" required>
                        </div>
                        <div class="field">
                            <label for="email">Email</label>
                            <input id="email" type="email" value="<%= emailUsuario %>" disabled>
                        </div>
                        <div class="field">
                            <label for="endereco">Endereco</label>
                            <input id="endereco" type="text" name="endereco" value="<%= enderecoFormulario == null ? "" : enderecoFormulario %>">
                        </div>
                        <button class="button" type="submit">Salvar alteracoes</button>
                    </form>
                </div>
            </div>
        </section>
    </div>
</body>
</html>
