<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="model.User" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Finalizar compra - Casa do Frango</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <%
        User usuarioLogado = (User) session.getAttribute("usuarioLogado");
        String nomeUsuario = usuarioLogado != null ? usuarioLogado.getNome() : null;
    %>
    <div class="page">
        <header class="topbar">
            <div class="brand">Casa do Frango</div>
            <div class="nav-actions nav-actions-spread">
                <% if (nomeUsuario != null) { %>
                    <div class="user-chip">
                        <span>Pedido de</span>
                        <strong><%= nomeUsuario %></strong>
                    </div>
                    <a class="button secondary" href="perfil">Perfil</a>
                    <a class="button ghost" href="historico-pedidos">Pedidos</a>
                    <a class="button secondary" href="logout">Sair</a>
                <% } else { %>
                    <a class="button secondary" href="login.jsp">Login</a>
                    <a class="button ghost" href="cadastro">Sign in</a>
                <% } %>
                <a class="button secondary" href="Carrinho">Voltar ao carrinho</a>
                <a class="button ghost" href="index.jsp">Inicio</a>
            </div>
        </header>

        <section class="hero auth-hero fade-in">
            <div>
                <span class="badge">Checkout</span>
                <h1>Finalizar pedido</h1>
                <p class="helper">Confirme o endereco de entrega e finalize o pedido. Os dados de pagamento sao apenas ilustrativos.</p>
                <% if (request.getAttribute("erro") != null) { %>
                    <div class="error" style="margin-top: 16px;"><%= request.getAttribute("erro") %></div>
                <% } %>
            </div>
            <div class="form-card">
                <h2>Informacoes do pedido</h2>
                <form action="checkout" method="post">
                    <div class="field">
                        <label for="enderecoEntrega">Endereco de entrega</label>
                        <input id="enderecoEntrega" type="text" name="enderecoEntrega" value="<%= usuarioLogado != null && usuarioLogado.getEndereco() != null ? usuarioLogado.getEndereco() : "" %>" required>
                    </div>
                    <div class="field">
                        <label for="titular">Nome do titular</label>
                        <input id="titular" type="text" name="titular" required>
                    </div>
                    <div class="field">
                        <label for="numero">Numero do cartao</label>
                        <input id="numero" type="text" name="numero" placeholder="0000 0000 0000 0000" required>
                    </div>
                    <div class="form-grid">
                        <div class="field">
                            <label for="validade">Validade</label>
                            <input id="validade" type="text" name="validade" placeholder="MM/AA" required>
                        </div>
                        <div class="field">
                            <label for="cvv">CVV</label>
                            <input id="cvv" type="text" name="cvv" placeholder="123" required>
                        </div>
                    </div>
                    <div class="field">
                        <label for="banco">Banco</label>
                        <input id="banco" type="text" name="banco" placeholder="Banco do Brasil" required>
                    </div>
                    <div class="summary" style="margin-top: 12px;">
                        <strong>Total do pedido</strong>
                        <span class="price">R$ <fmt:formatNumber value="${sessionScope.totalPedido}" minFractionDigits="2" maxFractionDigits="2"/></span>
                    </div>
                    <button class="button" type="submit" style="margin-top: 16px;">Finalizar pedido</button>
                </form>
            </div>
        </section>
    </div>
</body>
</html>
