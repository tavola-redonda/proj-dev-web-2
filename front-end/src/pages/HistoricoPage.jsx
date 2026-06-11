export default function HistoricoPage({ historico }) {
  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="section-title">Histórico de Pedidos</h2>
      {historico.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)' }}>Você ainda não realizou nenhum pedido.</p>
        </div>
      ) : (
        historico.map((pedido) => (
          <div className="order-card" key={pedido.id}>
            <div className="order-header">
              <span className="order-id">Pedido #{pedido.id}</span>
              <span className="order-date">{pedido.criadoEm}</span>
            </div>

            <div className="order-items">
              {pedido.itens.map((item) => (
                <div className="order-item-detail" key={item.id}>
                  <span style={{ color: 'var(--text)' }}>
                    {item.quantidade}x {item.nomeItem}
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}> ({item.categoriaItem})</span>
                  </span>
                  <span>R$ {item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Endereço de entrega:</span>
                <strong style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>{pedido.enderecoEntrega}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textAlign: 'right' }}>Valor Total:</span>
                <span className="order-total">R$ {pedido.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}