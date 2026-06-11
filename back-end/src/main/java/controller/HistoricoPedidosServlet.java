package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import com.google.gson.Gson;

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
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioLogado") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Unauthorized
            out.print("{\"erro\": \"Usuário não autenticado. Faça login para ver o histórico.\"}");
            out.flush();
            return;
        }

        User usuario = (User) session.getAttribute("usuarioLogado");
        
        try {
            PedidoDAO pedidoDAO = new PedidoDAO();
            List<Pedido> pedidos = pedidoDAO.listarPedidosPorUsuario(usuario.getId());
            
            response.setStatus(HttpServletResponse.SC_OK);
            out.print(this.gson.toJson(pedidos));
            
        } catch (RuntimeException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500
            out.print("{\"erro\": \"Erro ao buscar histórico de pedidos: " + e.getMessage() + "\"}");
        }
        
        out.flush();
    }
}