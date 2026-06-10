package model;

public class PedidoItem {

	private int id;
	private int pedidoId;
	private int itemCardapioId;
	private String nomeItem;
	private String categoriaItem;
	private int quantidade;
	private double precoUnitario;
	private double subtotal;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getPedidoId() {
		return pedidoId;
	}

	public void setPedidoId(int pedidoId) {
		this.pedidoId = pedidoId;
	}

	public int getItemCardapioId() {
		return itemCardapioId;
	}

	public void setItemCardapioId(int itemCardapioId) {
		this.itemCardapioId = itemCardapioId;
	}

	public String getNomeItem() {
		return nomeItem;
	}

	public void setNomeItem(String nomeItem) {
		this.nomeItem = nomeItem;
	}

	public String getCategoriaItem() {
		return categoriaItem;
	}

	public void setCategoriaItem(String categoriaItem) {
		this.categoriaItem = categoriaItem;
	}

	public int getQuantidade() {
		return quantidade;
	}

	public void setQuantidade(int quantidade) {
		this.quantidade = quantidade;
	}

	public double getPrecoUnitario() {
		return precoUnitario;
	}

	public void setPrecoUnitario(double precoUnitario) {
		this.precoUnitario = precoUnitario;
	}

	public double getSubtotal() {
		return subtotal;
	}

	public void setSubtotal(double subtotal) {
		this.subtotal = subtotal;
	}

	public String getPrecoUnitarioFormatado() {
		return String.format("R$ %.2f", precoUnitario);
	}

	public String getSubtotalFormatado() {
		return String.format("R$ %.2f", subtotal);
	}
}