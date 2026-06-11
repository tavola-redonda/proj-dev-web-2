package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.LinkedHashMap;
import java.util.Map;
import com.google.gson.Gson; 
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
    private final Gson gson = new Gson();

    /**
     * GET: Retorna os dados atuais do perfil do usuário para preencher o formulário no React
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioLogado") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Unauthorized
            out.print("{\"erro\": \"Usuário não autenticado.\"}");
            out.flush();
            return;
        }

        User usuario = (User) session.getAttribute("usuarioLogado");

        Map<String, Object> dadosPerfil = new LinkedHashMap<>();
        dadosPerfil.put("id", usuario.getId());
        dadosPerfil.put("nome", usuario.getNome());
        dadosPerfil.put("email", usuario.getEmail());
        dadosPerfil.put("telefone", usuario.getTelefone());
        dadosPerfil.put("endereco", usuario.getEndereco());
        dadosPerfil.put("isAdmin", usuario.getIs_admin());

        response.setStatus(HttpServletResponse.SC_OK); // 200 OK
        out.print(this.gson.toJson(dadosPerfil));
        out.flush();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        Map<String, Object> resposta = new LinkedHashMap<>();

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioLogado") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Unauthorized
            resposta.put("erro", "Usuário não autenticado.");
            out.print(this.gson.toJson(resposta));
            out.flush();
            return;
        }

        User usuario = (User) session.getAttribute("usuarioLogado");
        String nome = limpar(request.getParameter("nome"));
        String endereco = limpar(request.getParameter("endereco"));

        if (nome.isBlank()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 Bad Request
            resposta.put("erro", "O nome não pode ficar em branco.");
            out.print(this.gson.toJson(resposta));
            out.flush();
            return;
        }

        usuario.setNome(nome);
        usuario.setEndereco(endereco);

        UserDAO dao = new UserDAO();
        if (dao.atualizarPerfil(usuario)) {
            session.setAttribute("usuarioLogado", usuario);

            response.setStatus(HttpServletResponse.SC_OK); // 200 OK
            resposta.put("sucesso", true);
            resposta.put("mensagem", "Perfil atualizado com sucesso!");
            resposta.put("usuario", new LinkedHashMap<String, String>() {{
                put("nome", usuario.getNome());
                put("endereco", usuario.getEndereco());
            }});
            
            out.print(this.gson.toJson(resposta));
            out.flush();
            return;
        }

        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500
        resposta.put("erro", "Não foi possível atualizar o perfil no banco de dados.");
        out.print(this.gson.toJson(resposta));
        out.flush();
    }

    private String limpar(String valor) {
        return valor == null ? "" : valor.trim();
    }
}