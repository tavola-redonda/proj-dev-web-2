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
import model.User;
import util.PasswordUtil;

@WebServlet("/cadastro")
public class CadastroServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        Map<String, Object> resposta = new LinkedHashMap<>();

        String nome = limpar(request.getParameter("nome"));
        String telefoneRaw = limpar(request.getParameter("telefone"));
        String email = limpar(request.getParameter("email"));
        String endereco = limpar(request.getParameter("endereco"));
        String senha = request.getParameter("senha");
        String confirmarSenha = request.getParameter("confirmarSenha");

        String telefone = telefoneRaw.replaceAll("\\D", "");

        if (nome.isBlank() || email.isBlank() || senha == null || senha.isBlank()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 Bad Request
            resposta.put("erro", "Preencha nome, email e senha.");
            out.print(this.gson.toJson(resposta));
            out.flush();
            return;
        }

        if (!senha.equals(confirmarSenha)) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resposta.put("erro", "A senha e a confirmação não conferem.");
            out.print(this.gson.toJson(resposta));
            out.flush();
            return;
        }

        if (senha.length() < 6) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resposta.put("erro", "A senha precisa ter pelo menos 6 caracteres.");
            out.print(this.gson.toJson(resposta));
            out.flush();
            return;
        }

        UserDAO dao = new UserDAO();
        if (dao.emailJaCadastrado(email)) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resposta.put("erro", "Já existe um usuário cadastrado com este e-mail.");
            out.print(this.gson.toJson(resposta));
            out.flush();
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
            response.setStatus(HttpServletResponse.SC_CREATED); 
            resposta.put("sucesso", true);
            resposta.put("mensagem", "Usuário cadastrado com sucesso!");
            resposta.put("email", email);
            out.print(this.gson.toJson(resposta));
            out.flush();
            return;
        }

        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        resposta.put("erro", "Não foi possível criar o usuário no banco de dados.");
        out.print(this.gson.toJson(resposta));
        out.flush();
    }

    private String limpar(String valor) {
        return valor == null ? "" : valor.trim();
    }
}