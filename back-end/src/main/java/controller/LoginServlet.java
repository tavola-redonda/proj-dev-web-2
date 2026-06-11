package controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.LinkedHashMap;
import java.util.Map;
import com.google.gson.Gson;

import dao.UserDAO;
import model.User;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    private final Gson gson = new Gson();
       
    public LoginServlet() {
        super();
    }

    /**
     * GET: Verifica se o usuário já possui uma sessão ativa (Útil para o React manter o usuário logado ao atualizar a página)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        HttpSession sessao = request.getSession(false);
        Map<String, Object> resposta = new LinkedHashMap<>();
        
        if (sessao != null && sessao.getAttribute("usuarioLogado") != null) {
            User usuario = (User) sessao.getAttribute("usuarioLogado");
            response.setStatus(HttpServletResponse.SC_OK); // 200 OK
            resposta.put("autenticado", true);
            resposta.put("nome", usuario.getNome());
            resposta.put("email", usuario.getEmail());
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Unauthorized
            resposta.put("autenticado", false);
            resposta.put("erro", "Nenhuma sessão ativa.");
        }
        
        out.print(this.gson.toJson(resposta));
        out.flush();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        String email = request.getParameter("email");
        String senha = request.getParameter("senha");
        
        Map<String, Object> resposta = new LinkedHashMap<>();
        
        // Validação básica de payload nulo
        if (email == null || email.trim().isEmpty() || senha == null || senha.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); 
            resposta.put("erro", "E-mail e senha são obrigatórios.");
            out.print(this.gson.toJson(resposta));
            out.flush();
            return;
        }
        
        UserDAO dao = new UserDAO();
        User usuario = dao.validarLogin(email, senha);
        
        if (usuario != null) {
            HttpSession sessao = request.getSession();
            sessao.setAttribute("usuarioLogado", usuario);
            
            response.setStatus(HttpServletResponse.SC_OK); // 200 OK
            resposta.put("sucesso", true);
            resposta.put("mensagem", "Login realizado com sucesso!");
            resposta.put("usuario", new LinkedHashMap<String, String>() {{
                put("nome", usuario.getNome());
                put("email", usuario.getEmail());
            }});
            
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Unauthorized
            resposta.put("sucesso", false);
            resposta.put("erro", "E-mail ou senha incorretos.");
        }
        
        out.print(this.gson.toJson(resposta));
        out.flush();
    }
}