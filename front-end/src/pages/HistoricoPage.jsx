export default function HistoricoPage({ historico = [] }) {
  // Escudo 1: Se o Java não mandar nada ou der erro, assume um array vazio
  const safeHistorico = Array.isArray(historico) ? historico : [];

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="section-title">Histórico de Pedidos</h2>
      {safeHistorico.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)' }}>Você ainda não realizou nenhum pedido.</p>
        </div>
      ) : (
        safeHistorico.map((pedido) => {
          // Escudo 2: Protege os totais e a lista de itens
          const safeItens = Array.isArray(pedido?.itens) ? pedido.itens : [];
          const totalSeguro = Number(pedido?.total) || 0;

          return (
            <div className="order-card" key={pedido?.id || Math.random()}>
              <div className="order-header">
                <span className="order-id">Pedido #{pedido?.id}</span>
                <span className="order-date">{pedido?.criadoEm || 'Data Indisponível'}</span>
              </div>

              <div className="order-items">
                {safeItens.map((item) => {
                  const subtotalSeguro = Number(item?.subtotal) || 0;
                  
                  return (
                    <div className="order-item-detail" key={item?.id || Math.random()}>
                      <span style={{ color: 'var(--text)' }}>
                        {item?.quantidade || 1}x {item?.nomeItem || 'Produto'}
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}> ({item?.categoriaItem || 'Sem categoria'})</span>
                      </span>
                      <span>R$ {subtotalSeguro.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="order-footer">
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Endereço de entrega:</span>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>{pedido?.enderecoEntrega || 'Não informado'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textAlign: 'right' }}>Valor Total:</span>
                  <span className="order-total">R$ {totalSeguro.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}