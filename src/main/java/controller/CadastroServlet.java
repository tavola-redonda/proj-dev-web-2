package controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import dao.UserDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.User;
import util.PasswordUtil;

@WebServlet("/cadastro")
public class CadastroServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.getRequestDispatcher("cadastro.jsp").forward(request, response);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String nome = limpar(request.getParameter("nome"));
		String telefone = limpar(request.getParameter("telefone"));
		String email = limpar(request.getParameter("email"));
		String endereco = limpar(request.getParameter("endereco"));
		String senha = request.getParameter("senha");
		String confirmarSenha = request.getParameter("confirmarSenha");

		if (nome.isBlank() || email.isBlank() || senha == null || senha.isBlank()) {
			responderComErro(request, response, "Preencha nome, email e senha.");
			return;
		}

		if (!senha.equals(confirmarSenha)) {
			responderComErro(request, response, "A senha e a confirmacao nao conferem.");
			return;
		}

		if (senha.length() < 6) {
			responderComErro(request, response, "A senha precisa ter pelo menos 6 caracteres.");
			return;
		}

		UserDAO dao = new UserDAO();
		if (dao.emailJaCadastrado(email)) {
			responderComErro(request, response, "Ja existe um usuario cadastrado com este email.");
			return;
		}

		User usuario = new User();
		usuario.setNome(nome);
		usuario.setTelefone(telefone);
		usuario.setEmail(email);
		usuario.setEndereco(endereco);
		usuario.setIs_admin(false);
		usuario.setSenhaHash(PasswordUtil.hashPassword(senha));

		if (dao.criarUsuario(usuario)) {
			String emailCodificado = URLEncoder.encode(email, StandardCharsets.UTF_8.toString());
			response.sendRedirect(request.getContextPath() + "/login.jsp?cadastro=ok&email=" + emailCodificado);
			return;
		}

		responderComErro(request, response, "Nao foi possivel criar o usuario.");
	}

	private void responderComErro(HttpServletRequest request, HttpServletResponse response, String mensagem)
			throws ServletException, IOException {
		request.setAttribute("erro", mensagem);
		request.setAttribute("nome", limpar(request.getParameter("nome")));
		request.setAttribute("telefone", limpar(request.getParameter("telefone")));
		request.setAttribute("email", limpar(request.getParameter("email")));
		request.setAttribute("endereco", limpar(request.getParameter("endereco")));
		request.getRequestDispatcher("cadastro.jsp").forward(request, response);
	}

	private String limpar(String valor) {
		return valor == null ? "" : valor.trim();
	}
}