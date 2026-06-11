package controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import dao.ItemCardapioDAO;
import model.ItemCardapio;
import model.ItemCarrinho;
import com.google.gson.Gson;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;

@WebServlet(urlPatterns = {"/cardapio", "/main"})
public class ItemCardapioController extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ItemCardapioDAO dao = new ItemCardapioDAO();   
    private static final int LIMITE_POR_ITEM = 20;
    private static final int LIMITE_TOTAL_ITENS = 30;
    
    // Instancia o conversor JSON de forma global e reutilizável
    private final Gson gson = new Gson();

    public ItemCardapioController() {
        super();
    }

    /**
     * GET: Retorna o cardápio agrupado por categorias em formato JSON
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Configura a resposta como JSON e com suporte a caracteres especiais
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Autenticação Stateless (Para a API, se não houver usuário, responde 401 Unauthorized)
        if (request.getSession().getAttribute("usuarioLogado") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"erro\": \"Usuário não autenticado\"}");
            return;
        }

        // Configuração de Cache HTTP exigida pelo projeto (Mantido - Caio Bastos)
        response.setHeader("Cache-Control", "max-age=3600, public");
        response.setHeader("Pragma", "cache");
        response.setDateHeader("Expires", System.currentTimeMillis() + 3600000);
        
        List<ItemCardapio> lista = dao.listarProdutos();
        Map<String, List<ItemCardapio>> produtosPorCategoria = new LinkedHashMap<>();
        produtosPorCategoria.put("Pratos principais", new ArrayList<>());
        produtosPorCategoria.put("Bebidas", new ArrayList<>());
        produtosPorCategoria.put("Sobremesas", new ArrayList<>());

        for (ItemCardapio produto : lista) {
            String categoria = produto.getCategoria();
            if (!produtosPorCategoria.containsKey(categoria)) {
                produtosPorCategoria.put(categoria, new ArrayList<>());
            }
            produtosPorCategoria.get(categoria).add(produto);
        }
        
        String jsonResposta = this.gson.toJson(produtosPorCategoria);
        
        PrintWriter out = response.getWriter();
        out.print(jsonResposta);
        out.flush();
    }
    
    /**
     * POST: Adiciona itens ao carrinho e retorna o estado atualizado do carrinho em JSON
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        HttpSession session = request.getSession();
        
        if (session.getAttribute("usuarioLogado") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print("{\"erro\": \"Usuário não autenticado\"}");
            return;
        }

        List<ItemCarrinho> carrinho = (List<ItemCarrinho>) session.getAttribute("carrinho");
        if (carrinho == null) {
            carrinho = new ArrayList<>();
        }

        int idProduto = Integer.parseInt(request.getParameter("id"));
        int quantidade = 1;
        try {
            quantidade = Integer.parseInt(request.getParameter("quantidade"));
        } catch (NumberFormatException ignored) {
            quantidade = 1;
        }

        if (quantidade < 1) {
            quantidade = 1;
        }

        ItemCardapio produtoSelecionado = dao.buscarPorId(idProduto);
        if (produtoSelecionado == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"erro\": \"Não foi possível localizar o item selecionado.\"}");
            return;
        }

        int quantidadeAtualDoItem = 0;
        int totalItensCarrinho = 0;
        for (ItemCarrinho item : carrinho) {
            totalItensCarrinho += item.getQuantidade();
            if (item.getProduto().getId() == idProduto) {
                quantidadeAtualDoItem = item.getQuantidade();
            }
        }

        if (quantidadeAtualDoItem + quantidade > LIMITE_POR_ITEM) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"erro\": \"Cada item pode ter no máximo " + LIMITE_POR_ITEM + " unidades.\"}");
            return;
        }

        if (totalItensCarrinho + quantidade > LIMITE_TOTAL_ITENS) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"erro\": \"O carrinho pode ter no máximo " + LIMITE_TOTAL_ITENS + " itens no total.\"}");
            return;
        }

        boolean produtoJaExiste = false;
        for (ItemCarrinho item : carrinho) {
            if (item.getProduto().getId() == idProduto) {
                item.setQuantidade(item.getQuantidade() + Math.max(0, quantidade));
                produtoJaExiste = true;
                break;
            }
        }

        if (!produtoJaExiste) {
            carrinho.add(new ItemCarrinho(produtoSelecionado, quantidade));
        }

        session.setAttribute("carrinho", carrinho);
        
        double valorTotal = ItemCarrinho.calcularTotal(carrinho);
        session.setAttribute("totalPedido", valorTotal);
        
        Map<String, Object> respostaCarrinho = new LinkedHashMap<>();
        respostaCarrinho.put("itens", carrinho);
        respostaCarrinho.put("totalPedido", valorTotal);
        
        out.print(this.gson.toJson(respostaCarrinho));
        out.flush();
    }
}