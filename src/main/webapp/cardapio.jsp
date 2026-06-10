<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="model.User" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Cardapio - Casa do Frango</title>
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
                    <a class="button ghost" href="Carrinho">Carrinho</a>
                    <a class="button secondary" href="logout">Sair</a>
                <% } else { %>
                    <a class="button secondary" href="login.jsp">Login</a>
                    <a class="button ghost" href="cadastro">Sign in</a>
                <% } %>
                <a class="button secondary" href="index.jsp">Inicio</a>
            </div>
        </header>

        <section class="fade-in">
            <div class="badge">${produtos.size()} itens disponiveis</div>
            <%
                String erroCardapio = (String) session.getAttribute("erroCardapio");
                if (erroCardapio != null) {
            %>
                <div class="error" style="margin-top: 16px;"><%= erroCardapio %></div>
            <%
                    session.removeAttribute("erroCardapio");
                }
            %>

            <c:forEach var="entry" items="${produtosPorCategoria}">
                <c:if test="${not empty entry.value}">
                    <section class="catalog-section">
                        <div class="section-head">
                            <h2>${entry.key}</h2>
                            <span class="badge">${entry.value.size()} opcoes</span>
                        </div>
                        <div class="grid">
                            <c:forEach var="p" items="${entry.value}">
                                <div class="card">
                                    <h3>${p.nome}</h3>
                                    <p>${p.descricao}</p>
                                    <span class="price">R$ <fmt:formatNumber value="${p.preco}" minFractionDigits="2" maxFractionDigits="2"/></span>
                                    <form action="cardapio" method="POST" class="card-form">
                                        <input type="hidden" name="id" value="${p.id}">
                                        <div class="card-footer">
                                            <label class="quantity-control" for="quantidade-${p.id}">
                                                <span class="helper">Quantidade</span>
                                                <input id="quantidade-${p.id}" class="quantity-input" type="number" name="quantidade" min="1" max="20" value="1">
                                            </label>
                                            <button class="button" type="submit">Adicionar</button>
                                        </div>
                                    </form>
                                </div>
                            </c:forEach>
                        </div>
                    </section>
                </c:if>
            </c:forEach>

            <c:if test="${empty produtos}">
                <div class="error" style="margin-top: 16px;">A lista de produtos esta vazia.</div>
            </c:if>
        </section>
    </div>
</body>
</html>