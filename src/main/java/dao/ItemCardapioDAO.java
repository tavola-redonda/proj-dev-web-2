package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import model.ItemCardapio;

public class ItemCardapioDAO {

	public List<ItemCardapio> listarProdutos() {
        List<ItemCardapio> itemCardapios = new ArrayList<>();
    String sql = "SELECT * FROM itens_cardapio WHERE ativo = true ORDER BY nome";

        try (Connection con = ConnectionFactory.getConnection();
             PreparedStatement pst = con.prepareStatement(sql);
             ResultSet rs = pst.executeQuery()) {

            while (rs.next()) {
                ItemCardapio p = new ItemCardapio();
                p.setId(rs.getInt("id"));
                p.setNome(rs.getString("nome"));
                p.setDescricao(rs.getString("descricao"));
                p.setCategoria(inferirCategoria(p.getNome()));
                p.setPreco(rs.getDouble("preco"));
                p.setAtivo(rs.getBoolean("ativo"));
                
                
                System.out.println("Produto carregado do banco: " + p.getNome());
                itemCardapios.add(p);
            }
        } catch (Exception e) {
            System.err.println("Erro ao listar produtos: " + e.getMessage());
        }
        return itemCardapios;
    }
	
	public ItemCardapio buscarPorId(int id) {
	    String sql = "SELECT * FROM itens_cardapio WHERE id = ?";
	    try (Connection con = ConnectionFactory.getConnection();
	         PreparedStatement pst = con.prepareStatement(sql)) {
	        pst.setInt(1, id);
	        ResultSet rs = pst.executeQuery();
	        if (rs.next()) {
	            ItemCardapio p = new ItemCardapio();
	            p.setId(rs.getInt("id"));
	            p.setNome(rs.getString("nome"));
                p.setCategoria(inferirCategoria(p.getNome()));
	            p.setPreco(rs.getDouble("preco"));
                p.setDescricao(rs.getString("descricao"));
                p.setAtivo(rs.getBoolean("ativo"));

	            return p;
	        }
	    } catch (Exception e) { e.printStackTrace(); }
	    return null;
	}

    private String inferirCategoria(String nome) {
        if (nome == null) {
            return "Pratos principais";
        }

        switch (nome) {
            case "Frango Assado":
            case "Hamburguer Artesanal":
            case "Pizza Margherita":
                return "Pratos principais";
            case "Suco Natural":
            case "Refrigerante de Cola":
            case "Agua com Gas":
                return "Bebidas";
            case "Pudim de Leite":
            case "Brownie com Sorvete":
            case "Torta de Limão":
                return "Sobremesas";
            default:
                return "Pratos principais";
        }
    }
}
