package dao;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import model.ItemCarrinho;
import model.Pedido;
import model.PedidoItem;
import model.User;

public class PedidoDAO {

	public int criarPedido(User usuario, String enderecoEntrega, List<ItemCarrinho> carrinho) {
		if (usuario == null || carrinho == null || carrinho.isEmpty()) {
			return 0;
		}

		BigDecimal totalPedido = BigDecimal.valueOf(ItemCarrinho.calcularTotal(carrinho)).setScale(2, RoundingMode.HALF_UP);
		String sqlPedido = "INSERT INTO pedidos (usuario_id, endereco_entrega, total) VALUES (?, ?, ?)";
		String sqlItem = "INSERT INTO pedido_itens (pedido_id, item_cardapio_id, nome_item, categoria_item, quantidade, preco_unitario, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?)";

		Connection con = null;
		try {
			con = ConnectionFactory.getConnection();
			con.setAutoCommit(false);

			int pedidoId;
			try (PreparedStatement pstPedido = con.prepareStatement(sqlPedido, Statement.RETURN_GENERATED_KEYS)) {
				pstPedido.setInt(1, usuario.getId());
				pstPedido.setString(2, enderecoEntrega);
				pstPedido.setBigDecimal(3, totalPedido);
				pstPedido.executeUpdate();

				try (ResultSet rs = pstPedido.getGeneratedKeys()) {
					if (!rs.next()) {
						throw new IllegalStateException("Nao foi possivel recuperar o ID do pedido");
					}
					pedidoId = rs.getInt(1);
				}
			}

			try (PreparedStatement pstItem = con.prepareStatement(sqlItem)) {
				for (ItemCarrinho item : carrinho) {
					String categoriaItem = item.getProduto().getCategoria();
					if (categoriaItem == null || categoriaItem.isBlank()) {
						categoriaItem = "Pratos principais";
					}
					BigDecimal precoUnitario = BigDecimal.valueOf(item.getProduto().getPreco()).setScale(2, RoundingMode.HALF_UP);
					BigDecimal subtotal = BigDecimal.valueOf(item.getSubtotal()).setScale(2, RoundingMode.HALF_UP);
					pstItem.setInt(1, pedidoId);
					pstItem.setInt(2, item.getProduto().getId());
					pstItem.setString(3, item.getProduto().getNome());
					pstItem.setString(4, categoriaItem);
					pstItem.setInt(5, item.getQuantidade());
					pstItem.setBigDecimal(6, precoUnitario);
					pstItem.setBigDecimal(7, subtotal);
					pstItem.addBatch();
				}
				pstItem.executeBatch();
			}

			con.commit();
			return pedidoId;
		} catch (Exception e) {
			if (con != null) {
				try {
					con.rollback();
				} catch (Exception ignored) {
				}
			}
			throw new RuntimeException("Nao foi possivel salvar o pedido", e);
		} finally {
			if (con != null) {
				try {
					con.close();
				} catch (Exception ignored) {
				}
			}
		}
	}

	public List<Pedido> listarPedidosPorUsuario(int usuarioId) {
		List<Pedido> pedidos = new ArrayList<>();
		String sql = "SELECT p.id AS pedido_id, p.usuario_id, p.endereco_entrega, p.total, p.criado_em, " +
				     "pi.id AS item_id, pi.item_cardapio_id, pi.nome_item, pi.categoria_item, pi.quantidade, pi.preco_unitario, pi.subtotal " +
				     "FROM pedidos p " +
				     "LEFT JOIN pedido_itens pi ON pi.pedido_id = p.id " +
				     "WHERE p.usuario_id = ? " +
				     "ORDER BY p.criado_em DESC, p.id DESC, pi.id ASC";

		try (Connection con = ConnectionFactory.getConnection();
			 PreparedStatement pst = con.prepareStatement(sql)) {
			pst.setInt(1, usuarioId);

			try (ResultSet rs = pst.executeQuery()) {
				Map<Integer, Pedido> pedidosPorId = new LinkedHashMap<>();
				while (rs.next()) {
					int pedidoId = rs.getInt("pedido_id");
					Pedido pedido = pedidosPorId.get(pedidoId);
					if (pedido == null) {
						pedido = new Pedido();
						pedido.setId(pedidoId);
						pedido.setUsuarioId(rs.getInt("usuario_id"));
						pedido.setEnderecoEntrega(rs.getString("endereco_entrega"));
						pedido.setTotal(rs.getBigDecimal("total").doubleValue());
						pedido.setCriadoEm(rs.getTimestamp("criado_em").toLocalDateTime());
						pedidosPorId.put(pedidoId, pedido);
					}

					int itemId = rs.getInt("item_id");
					if (!rs.wasNull()) {
						PedidoItem item = new PedidoItem();
						item.setId(itemId);
						item.setPedidoId(pedidoId);
						item.setItemCardapioId(rs.getInt("item_cardapio_id"));
						item.setNomeItem(rs.getString("nome_item"));
						item.setCategoriaItem(rs.getString("categoria_item"));
						item.setQuantidade(rs.getInt("quantidade"));
						item.setPrecoUnitario(rs.getBigDecimal("preco_unitario").doubleValue());
						item.setSubtotal(rs.getBigDecimal("subtotal").doubleValue());
						pedido.adicionarItem(item);
					}
				}

				pedidos.addAll(pedidosPorId.values());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return pedidos;
	}
}