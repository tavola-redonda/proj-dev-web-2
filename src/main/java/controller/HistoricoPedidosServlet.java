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
import model.Pedido;
import model.User;

@WebServlet("/historico-pedidos")
public class HistoricoPedidosServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession(false);
		if (session == null || session.getAttribute("usuarioLogado") == null) {
			response.sendRedirect("login.jsp");
			return;
		}

		User usuario = (User) session.getAttribute("usuarioLogado");
		PedidoDAO pedidoDAO = new PedidoDAO();
		List<Pedido> pedidos = pedidoDAO.listarPedidosPorUsuario(usuario.getId());
		request.setAttribute("pedidos", pedidos);
		request.getRequestDispatcher("historico-pedidos.jsp").forward(request, response);
	}
}