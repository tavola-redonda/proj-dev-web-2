package controller;


import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import jakarta.servlet.RequestDispatcher;
import dao.ItemCardapioDAO;
import model.ItemCardapio;
import model.ItemCarrinho;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;



@WebServlet(urlPatterns = {"/cardapio","/main"})
public class ItemCardapioController extends HttpServlet {
	private static final long serialVersionUID = 1L;
    ItemCardapioDAO dao = new ItemCardapioDAO();   
    private static final int LIMITE_POR_ITEM = 20;
    private static final int LIMITE_TOTAL_ITENS = 30;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ItemCardapioController() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
    	if (request.getSession().getAttribute("usuarioLogado") == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        // Configuração de Cache HTTP exigida pelo projeto (Adição - Caio Bastos)
        response.setHeader("Cache-Control", "max-age=3600, public");
        response.setHeader("Pragma", "cache");
        response.setDateHeader("Expires", System.currentTimeMillis() + 3600000);
    	
        ItemCardapioDAO dao = new ItemCardapioDAO();
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
        
        request.setAttribute("produtos", lista);
            request.setAttribute("produtosPorCategoria", produtosPorCategoria);
        System.out.println("DEBUG: Itens encontrados no banco: " + (lista != null ? lista.size() : "null"));

        RequestDispatcher rd = request.getRequestDispatcher("cardapio.jsp");
        rd.forward(request, response);
    }
    
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        
        if (session.getAttribute("usuarioLogado") == null) {
            response.sendRedirect("login.jsp");
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
            session.setAttribute("erroCardapio", "Nao foi possivel localizar o item selecionado.");
            response.sendRedirect("cardapio");
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
            session.setAttribute("erroCardapio", "Cada item pode ter no maximo " + LIMITE_POR_ITEM + " unidades.");
            response.sendRedirect("cardapio");
            return;
        }

        if (totalItensCarrinho + quantidade > LIMITE_TOTAL_ITENS) {
            session.setAttribute("erroCardapio", "O carrinho pode ter no maximo " + LIMITE_TOTAL_ITENS + " itens no total.");
            response.sendRedirect("cardapio");
            return;
        }

        boolean produtoJaExiste = false;

        for (ItemCarrinho item : carrinho) {
            if (item.getProduto().getId() == idProduto) {
                item.setQuantidade(item.getQuantidade() + quantidade);
                produtoJaExiste = true;
                break;
            }
        }

        if (!produtoJaExiste) {
            carrinho.add(new ItemCarrinho(produtoSelecionado, quantidade));
        }

        session.setAttribute("carrinho", carrinho);
        session.removeAttribute("erroCardapio");
        
        
        double valorTotal = ItemCarrinho.calcularTotal(carrinho);
        session.setAttribute("totalPedido", valorTotal);
        response.sendRedirect("carrinho.jsp");
    }

}
