package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import com.google.gson.Gson; // Import do Gson

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
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        Map<String, Object> resposta = new LinkedHashMap<>();

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioLogado") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Unauthorized
            resposta.put("erro", "Usuário não autenticado. Faça login para finalizar o pedido.");
            out.print(this.gson.toJson(resposta));
            out.flush();
            return;
        }

        User usuario = (User) session.getAttribute("usuarioLogado");
        List<ItemCarrinho> carrinho = (List<ItemCarrinho>) session.getAttribute("carrinho");

        if (carrinho == null || carrinho.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 Bad Request
            resposta.put("erro", "O carrinho está vazio. Adicione itens antes de finalizar.");
            out.print(this.gson.toJson(resposta));
            out.flush();
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
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500
                resposta.put("erro", "Erro interno: Não foi possível registrar o pedido no banco de dados.");
                out.print(this.gson.toJson(resposta));
                out.flush();
                return;
            }

            session.removeAttribute("carrinho");
            session.removeAttribute("totalPedido");
            
            response.setStatus(HttpServletResponse.SC_CREATED); // 201 Created
            resposta.put("sucesso", true);
            resposta.put("mensagem", "Pedido finalizado com sucesso!");
            resposta.put("pedidoId", pedidoId);

        } catch (RuntimeException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500
            resposta.put("erro", "Falha crítica no processamento do checkout: " + e.getMessage());
        }

        out.print(this.gson.toJson(resposta));
        out.flush();
    }

    private String limpar(String valor) {
        return valor == null ? "" : valor.trim();
    }
}