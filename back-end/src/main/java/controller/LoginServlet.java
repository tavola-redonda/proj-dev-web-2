package controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import dao.UserDAO;
import model.User;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Servlet implementation class LoginServlet
 */
@WebServlet("/login")
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoginServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email = request.getParameter("email");
        String senha = request.getParameter("senha");
        
        UserDAO dao = new UserDAO();
        User usuario = dao.validarLogin(email, senha);
        
        if (usuario != null) {

        	
            HttpSession sessao = request.getSession();
            sessao.setAttribute("usuarioLogado", usuario);
            
            String nomeCodificado = URLEncoder.encode(usuario.getNome(), StandardCharsets.UTF_8.toString());
            Cookie cookieNome = new Cookie("nomeUsuario", nomeCodificado);
            cookieNome.setMaxAge(60 * 60 * 24); 
            response.addCookie(cookieNome);
            
            response.sendRedirect("index.jsp");
        } else {
            request.setAttribute("erro", "E-mail ou senha incorretos.");
            request.getRequestDispatcher("login.jsp").forward(request, response);
        }
    }

}
