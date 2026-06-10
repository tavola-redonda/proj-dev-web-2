package controller;

import java.io.IOException;
import java.util.List;

import dao.PedidoDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.ItemCarrinho;
import model.User;

@WebServlet("/checkout")
public class CheckoutServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession(false);
		if (session == null || session.getAttribute("usuarioLogado") == null) {
			response.sendRedirect("login.jsp");
			return;
		}

		request.getRequestDispatcher("checkout.jsp").forward(request, response);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession(false);
		if (session == null || session.getAttribute("usuarioLogado") == null) {
			response.sendRedirect("login.jsp");
			return;
		}

		User usuario = (User) session.getAttribute("usuarioLogado");
		List<ItemCarrinho> carrinho = (List<ItemCarrinho>) session.getAttribute("carrinho");
		if (carrinho == null || carrinho.isEmpty()) {
			response.sendRedirect("Carrinho");
			return;
		}

		String enderecoEntrega = limpar(request.getParameter("enderecoEntrega"));
		if (enderecoEntrega.isBlank()) {
			enderecoEntrega = usuario.getEndereco() != null ? usuario.getEndereco() : "";
		}

		try {
			PedidoDAO pedidoDAO = new PedidoDAO();
			int pedidoId = pedidoDAO.criarPedido(usuario, enderecoEntrega, carrinho);
			if (pedidoId <= 0) {
				request.setAttribute("erro", "Nao foi possivel finalizar o pedido.");
				request.getRequestDispatcher("checkout.jsp").forward(request, response);
				return;
			}

			session.removeAttribute("carrinho");
			session.removeAttribute("totalPedido");
			session.setAttribute("pedidoFinalizadoId", pedidoId);
			response.sendRedirect(request.getContextPath() + "/historico-pedidos?pedido=ok");
		} catch (RuntimeException e) {
			request.setAttribute("erro", "Nao foi possivel finalizar o pedido.");
			request.getRequestDispatcher("checkout.jsp").forward(request, response);
		}
	}

	private String limpar(String valor) {
		return valor == null ? "" : valor.trim();
	}
}