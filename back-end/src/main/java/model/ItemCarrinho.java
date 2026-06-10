package model;

import java.util.List;


public class ItemCarrinho {

	private ItemCardapio itemCardapio;
    private int quantidade;

    public ItemCarrinho(ItemCardapio itemCardapio, int quantidade) {
        this.itemCardapio = itemCardapio;
        this.quantidade = quantidade;
    }

    public ItemCardapio getProduto() { return itemCardapio; }
    public void setProduto(ItemCardapio itemCardapio) { this.itemCardapio = itemCardapio; }
    public int getQuantidade() { return quantidade; }
    public void setQuantidade(int quantidade) { this.quantidade = quantidade; }

    public double getSubtotal() {
        return itemCardapio.getPreco() * quantidade;
    }
	
    public String getSubtotalFormatado() {
        return String.format("R$ %.2f", this.getSubtotal());
    }
    
    public static double calcularTotal(List<ItemCarrinho> carrinho) {
        double total = 0;
        if (carrinho != null) {
            for (ItemCarrinho item : carrinho) {
                total += item.getSubtotal(); 
            }
        }
        return total;
    }
}
