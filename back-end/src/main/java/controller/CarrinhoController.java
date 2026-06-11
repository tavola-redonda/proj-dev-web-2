package controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import com.google.gson.Gson;

import dao.ItemCardapioDAO;
import model.ItemCardapio;
import model.ItemCarrinho;

@WebServlet("/Carrinho")
public class CarrinhoController extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final Gson gson = new Gson();

    public CarrinhoController() {
        super();
    }


    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        HttpSession sessao = request.getSession(false);
        if (sessao == null || sessao.getAttribute("usuarioLogado") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
            out.print("{\"erro\": \"Usuário não autenticado\"}");
            return;
        }

        List<ItemCarrinho> carrinho = (List<ItemCarrinho>) sessao.getAttribute("carrinho");
        if (carrinho == null) {
            carrinho = new ArrayList<>();
            sessao.setAttribute("carrinho", carrinho);
        }

        double valorTotal = ItemCarrinho.calcularTotal(carrinho);
        sessao.setAttribute("totalPedido", valorTotal);

        Map<String, Object> resposta = new LinkedHashMap<>();
        resposta.put("itens", carrinho);
        resposta.put("totalPedido", valorTotal);

        out.print(this.gson.toJson(resposta));
        out.flush();
    }


    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        HttpSession sessao = request.getSession(false);
        if (sessao == null || sessao.getAttribute("usuarioLogado") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print("{\"erro\": \"Usuário não autenticado\"}");
            return;
        }

        String acao = request.getParameter("acao");
        List<ItemCarrinho> carrinho = (List<ItemCarrinho>) sessao.getAttribute("carrinho");
        if (carrinho == null) {
            carrinho = new ArrayList<>();
            sessao.setAttribute("carrinho", carrinho);
        }

        try {
            if ("add".equals(acao)) {
                int id = Integer.parseInt(request.getParameter("id"));
                boolean existe = false;

                for (ItemCarrinho item : carrinho) {
                    if (item.getProduto().getId() == id) {
                        item.setQuantidade(item.getQuantidade() + 1);
                        existe = true;
                        break;
                    }
                }

                if (!existe) {
                    ItemCardapioDAO dao = new ItemCardapioDAO();
                    ItemCardapio p = dao.buscarPorId(id); 
                    if (p != null) {
                        carrinho.add(new ItemCarrinho(p, 1));
                    } else {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        out.print("{\"erro\": \"Produto não encontrado.\"}");
                        return;
                    }
                }
            }

            // Processa a REMOÇÃO de produtos
            else if ("remove".equals(acao)) {
                int id = Integer.parseInt(request.getParameter("id"));
                for (int i = 0; i < carrinho.size(); i++) {
                    if (carrinho.get(i).getProduto().getId() == id) {
                        carrinho.remove(i);
                        break;
                    }
                }
            } 
            
            else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"erro\": \"Ação inválida ou não informada.\"}");
                return;
            }

        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"erro\": \"ID do produto deve ser um número válido.\"}");
            return;
        }

        double valorTotal = ItemCarrinho.calcularTotal(carrinho);
        sessao.setAttribute("carrinho", carrinho);
        sessao.setAttribute("totalPedido", valorTotal);

        Map<String, Object> resposta = new LinkedHashMap<>();
        resposta.put("itens", carrinho);
        resposta.put("totalPedido", valorTotal);

        out.print(this.gson.toJson(resposta));
        out.flush();
    }
}