package controller;

import java.io.IOException;

import dao.UserDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.User;

@WebServlet("/perfil")
public class PerfilServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession(false);
		if (session == null || session.getAttribute("usuarioLogado") == null) {
			response.sendRedirect("login.jsp");
			return;
		}

		request.getRequestDispatcher("perfil.jsp").forward(request, response);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession(false);
		if (session == null || session.getAttribute("usuarioLogado") == null) {
			response.sendRedirect("login.jsp");
			return;
		}

		User usuario = (User) session.getAttribute("usuarioLogado");
		String nome = limpar(request.getParameter("nome"));
		String endereco = limpar(request.getParameter("endereco"));

		if (nome.isBlank()) {
			request.setAttribute("erro", "O nome nao pode ficar em branco.");
			request.getRequestDispatcher("perfil.jsp").forward(request, response);
			return;
		}

		usuario.setNome(nome);
		usuario.setEndereco(endereco);

		UserDAO dao = new UserDAO();
		if (dao.atualizarPerfil(usuario)) {
			session.setAttribute("usuarioLogado", usuario);
			response.sendRedirect(request.getContextPath() + "/perfil?ok=1");
			return;
		}

		request.setAttribute("erro", "Nao foi possivel atualizar o perfil.");
		request.getRequestDispatcher("perfil.jsp").forward(request, response);
	}

	private String limpar(String valor) {
		return valor == null ? "" : valor.trim();
	}
}