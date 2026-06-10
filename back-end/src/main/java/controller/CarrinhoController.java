package controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.ItemCardapio;
import model.ItemCarrinho;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import dao.ItemCardapioDAO;

/**
 * Servlet implementation class CarrinhoController
 */
@WebServlet("/Carrinho")
public class CarrinhoController extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CarrinhoController() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1. Captura os parâmetros e a sessão atual
        String acao = request.getParameter("acao");
        HttpSession sessao = request.getSession();
        
        // 2. Recupera ou inicializa o carrinho na sessão
        List<ItemCarrinho> carrinho = (List<ItemCarrinho>) sessao.getAttribute("carrinho");
        if (carrinho == null) {
            carrinho = new ArrayList<>();
            sessao.setAttribute("carrinho", carrinho);
        }

        // 3. Processa a adição de produtos com AGRUPAMENTO
        if ("add".equals(acao)) {
            int id = Integer.parseInt(request.getParameter("id"));
            boolean existe = false;

            // Verifica se o item já está na lista para apenas aumentar a quantidade
            for (ItemCarrinho item : carrinho) {
                if (item.getProduto().getId() == id) {
                    item.setQuantidade(item.getQuantidade() + 1);
                    existe = true;
                    break;
                }
            }

            // Se o produto é novo no carrinho, busca no banco e adiciona
            if (!existe) {
                ItemCardapioDAO dao = new ItemCardapioDAO();
                ItemCardapio p = dao.buscarPorId(id); 
                if (p != null) {
                    carrinho.add(new ItemCarrinho(p, 1));
                }
            }
        }

        if ("remove".equals(acao)) {
            int id = Integer.parseInt(request.getParameter("id"));
            for (int i = 0; i < carrinho.size(); i++) {
                if (carrinho.get(i).getProduto().getId() == id) {
                    carrinho.remove(i);
                    break;
                }
            }
        }

        // 4. Calcula o valor total e armazena na SESSÃO
        // Isso garante que o valor persista após o redirecionamento
        double valorTotal = ItemCarrinho.calcularTotal(carrinho);
        sessao.setAttribute("totalPedido", valorTotal);

        // 5. Redireciona para a View
        response.sendRedirect("carrinho.jsp");
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
