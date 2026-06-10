<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="model.User" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Historico de pedidos - Casa do Frango</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <%
        User usuarioLogado = (User) session.getAttribute("usuarioLogado");
        String nomeUsuario = usuarioLogado != null ? usuarioLogado.getNome() : "";
        boolean pedidoOk = "ok".equals(request.getParameter("pedido"));
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
                    <a class="button secondary" href="perfil">Perfil</a>
                    <a class="button ghost" href="Carrinho">Carrinho</a>
                    <a class="button secondary" href="logout">Sair</a>
                <% } %>
                <a class="button secondary" href="cardapio">Cardapio</a>
                <a class="button ghost" href="index.jsp">Inicio</a>
            </div>
        </header>

        <section class="hero auth-hero fade-in">
            <div>
                <span class="badge">Pedidos</span>
                <h1>Historico de pedidos</h1>
                <p>Veja o endereco utilizado, o valor final e os detalhes de cada pedido realizado na sua conta.</p>
                <% if (pedidoOk) { %>
                    <div class="success" style="margin-top: 16px;">Pedido finalizado com sucesso.</div>
                <% } %>
            </div>
            <div class="panel">
                <h2>Resumo da conta</h2>
                <div class="profile-meta">
                    <div class="meta-row">
                        <span>Usuario</span>
                        <strong><%= nomeUsuario %></strong>
                    </div>
                    <div class="meta-row">
                        <span>Pedidos registrados</span>
                        <strong>${pedidos.size()}</strong>
                    </div>
                </div>
            </div>
        </section>

        <section class="history-list fade-in">
            <c:choose>
                <c:when test="${not empty pedidos}">
                    <c:forEach var="pedido" items="${pedidos}">
                        <article class="order-card" id="pedido-${pedido.id}">
                            <button type="button" class="order-toggle" onclick="togglePedido(this)" aria-expanded="false">
                                <div class="order-summary">
                                    <strong>Pedido #${pedido.id}</strong>
                                    <span class="order-meta">Criado em ${pedido.criadoEmFormatado}</span>
                                    <span class="order-meta">Endereco: ${pedido.enderecoEntrega}</span>
                                </div>
                                <div class="order-summary" style="align-items: flex-end; text-align: right;">
                                    <strong>${pedido.totalFormatado}</strong>
                                    <span class="order-meta">${pedido.itens.size()} itens</span>
                                    <span class="order-meta toggle-label">Ver detalhes</span>
                                </div>
                            </button>
                            <div class="order-details">
                                <div class="order-details-inner">
                                    <table class="order-items">
                                        <tr>
                                            <th>Item</th>
                                            <th>Categoria</th>
                                            <th>Qtd</th>
                                            <th>Unitario</th>
                                            <th>Subtotal</th>
                                        </tr>
                                        <c:forEach var="item" items="${pedido.itens}">
                                            <tr>
                                                <td>${item.nomeItem}</td>
                                                <td>${item.categoriaItem}</td>
                                                <td>${item.quantidade}</td>
                                                <td>${item.precoUnitarioFormatado}</td>
                                                <td>${item.subtotalFormatado}</td>
                                            </tr>
                                        </c:forEach>
                                    </table>
                                </div>
                            </div>
                        </article>
                    </c:forEach>
                </c:when>
                <c:otherwise>
                    <div class="empty-state">
                        <h2>Voce ainda nao realizou pedidos</h2>
                        <p class="helper">Volte ao cardapio, selecione seus pratos e finalize o pedido para ver o historico aqui.</p>
                        <div class="nav-actions" style="justify-content: center; margin-top: 16px;">
                            <a class="button" href="cardapio">Ir ao cardapio</a>
                            <a class="button secondary" href="perfil">Ver perfil</a>
                        </div>
                    </div>
                </c:otherwise>
            </c:choose>
        </section>
    </div>

    <script>
        function togglePedido(button) {
            const card = button.closest('.order-card');
            if (!card) {
                return;
            }

            const expanded = card.classList.toggle('is-open');
            button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            const label = button.querySelector('.toggle-label');
            if (label) {
                label.textContent = expanded ? 'Ocultar detalhes' : 'Ver detalhes';
            }
        }
    </script>
</body>
</html>
