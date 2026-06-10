<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="model.User" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.ArrayList" %>
<!DOCTYPE html>
<html>
<head>
    <title>Carrinho - Casa do Frango</title>
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
                <a class="button secondary" href="cardapio">Continuar comprando</a>
                <a class="button ghost" href="checkout">Fechar pedido</a>
                <a class="button secondary" href="index.jsp">Inicio</a>
            </div>
        </header>

        <section class="fade-in">
            <c:choose>
                <c:when test="${not empty sessionScope.carrinho}">
                    <table class="table">
                        <tr>
                            <th>Produto</th>
                            <th>Preco unit.</th>
                            <th>Qtd</th>
                            <th>Subtotal</th>
                            <th>Acao</th>
                        </tr>
                        <c:forEach var="item" items="${sessionScope.carrinho}">
                            <tr>
                                <td>${item.produto.nome}</td>
                                <td>R$ <fmt:formatNumber value="${item.produto.preco}" minFractionDigits="2" maxFractionDigits="2"/></td>
                                <td>${item.quantidade}</td>
                                <td>${item.subtotalFormatado}</td>
                                <td>
                                    <form action="Carrinho" method="post">
                                        <input type="hidden" name="acao" value="remove">
                                        <input type="hidden" name="id" value="${item.produto.id}">
                                        <button class="button secondary" type="submit">Remover</button>
                                    </form>
                                </td>
                            </tr>
                        </c:forEach>
                    </table>
                </c:when>
                <c:otherwise>
                    <div class="empty-state">
                        <h2>Seu carrinho esta vazio</h2>
                        <p class="helper">Escolha alguns pratos no cardapio para montar o pedido.</p>
                        <div class="nav-actions" style="justify-content: center; margin-top: 16px;">
                            <a class="button" href="cardapio">Ir ao cardapio</a>
                            <a class="button secondary" href="historico-pedidos">Ver pedidos</a>
                        </div>
                    </div>
                </c:otherwise>
            </c:choose>

<%
    List<model.ItemCarrinho> listaItens = (List<model.ItemCarrinho>) session.getAttribute("carrinho");
    double somaTotal = 0;
    if (listaItens != null) {
        for (model.ItemCarrinho i : listaItens) {
            somaTotal += i.getSubtotal();
        }
    }
    pageContext.setAttribute("totalCalculadoNoJsp", somaTotal);
%>

            <c:if test="${not empty sessionScope.carrinho}">
                <div class="summary">
                    <strong>Total do pedido</strong>
                    <span class="price">R$ ${String.format("%.2f", totalCalculadoNoJsp)}</span>
                </div>
            </c:if>
        </section>
    </div>

</body>
</html>