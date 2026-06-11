export default function HistoricoPage({ historico = [] }) {
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
          const safeItens = Array.isArray(pedido?.itens) ? pedido.itens : [];

          // ESCUDO DO TOTAL: Procura o parsedValue dentro do objeto que o Java mandou
          const totalSeguro = Number(pedido?.total?.parsedValue || pedido?.total || 0);

          // ESCUDO DA DATA: Monta a data no formato BR (DD/MM/YYYY às HH:MM)
          let dataFormatada = 'Data Indisponível';
          if (pedido?.criadoEm?.date) {
            const { day, month, year } = pedido.criadoEm.date;
            const { hour, minute } = pedido.criadoEm.time || { hour: 0, minute: 0 };
            dataFormatada = `${day}/${month}/${year} às ${hour}:${String(minute).padStart(2, '0')}`;
          } else if (typeof pedido?.criadoEm === 'string') {
            dataFormatada = pedido.criadoEm;
          }

          return (
            <div className="order-card" key={pedido?.id || Math.random()}>
              <div className="order-header">
                <span className="order-id">Pedido #{pedido?.id}</span>
                <span className="order-date">{dataFormatada}</span>
              </div>

              <div className="order-items">
                {safeItens.map((item) => {
                  // ESCUDO DO SUBTOTAL: Pegando o parsedValue do item
                  const subtotalSeguro = Number(item?.subtotal?.parsedValue || item?.subtotal || 0);
                  
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