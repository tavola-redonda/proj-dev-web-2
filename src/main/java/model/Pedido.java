package model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class Pedido {

	private int id;
	private int usuarioId;
	private String enderecoEntrega;
	private double total;
	private LocalDateTime criadoEm;
	private final List<PedidoItem> itens = new ArrayList<>();

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getUsuarioId() {
		return usuarioId;
	}

	public void setUsuarioId(int usuarioId) {
		this.usuarioId = usuarioId;
	}

	public String getEnderecoEntrega() {
		return enderecoEntrega;
	}

	public void setEnderecoEntrega(String enderecoEntrega) {
		this.enderecoEntrega = enderecoEntrega;
	}

	public double getTotal() {
		return total;
	}

	public void setTotal(double total) {
		this.total = total;
	}

	public LocalDateTime getCriadoEm() {
		return criadoEm;
	}

	public void setCriadoEm(LocalDateTime criadoEm) {
		this.criadoEm = criadoEm;
	}

	public List<PedidoItem> getItens() {
		return itens;
	}

	public void adicionarItem(PedidoItem item) {
		this.itens.add(item);
	}

	public String getTotalFormatado() {
		return String.format("R$ %.2f", total);
	}

	public String getCriadoEmFormatado() {
		if (criadoEm == null) {
			return "";
		}
		return criadoEm.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
	}
}