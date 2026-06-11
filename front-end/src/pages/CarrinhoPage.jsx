export default function CarrinhoPage({ cart, totalPedido, onUpdateCartItem, onNavigate }) {
  const totalItems = cart.reduce((accumulator, item) => accumulator + item.quantidade, 0);

  return (
    <div className="fade-in">
      <h2 className="section-title">Meu Carrinho</h2>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛒</div>
          <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Seu carrinho está vazio</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Navegue por nosso cardápio e adicione deliciosos frangos ao seu pedido!</p>
          <button type="button" className="btn btn-primary" onClick={() => onNavigate('cardapio')}>Ver Cardápio</button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-item" key={item.produto.id}>
                <div className="cart-item-info">
                  <h4>{item.produto.nome}</h4>
                  <p>{item.produto.categoria} | R$ {item.produto.preco.toFixed(2)} cada</p>
                </div>
                <div className="cart-item-actions">
                  <div className="cart-item-qty">
                    <button type="button" className="qty-btn" onClick={() => onUpdateCartItem(item.produto.id, 'sub')}>-</button>
                    <span style={{ fontWeight: 600, width: '20px', textAlign: 'center' }}>{item.quantidade}</span>
                    <button type="button" className="qty-btn" onClick={() => onUpdateCartItem(item.produto.id, 'add')}>+</button>
                  </div>
                  <span style={{ fontWeight: 700, minWidth: '80px', textAlign: 'right' }}>R$ {item.subtotal.toFixed(2)}</span>
                  <button type="button" className="btn btn-ghost" style={{ color: 'var(--danger)', padding: '0.4rem' }} onClick={() => onUpdateCartItem(item.produto.id, 'remove')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3 style={{ marginBottom: '1rem', fontWeight: 700, color: 'var(--secondary)' }}>Resumo da Compra</h3>
            <div className="summary-row">
              <span>Itens ({totalItems})</span>
              <span>R$ {totalPedido.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Entrega</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>Grátis</span>
            </div>
            <div className="summary-row summary-row-total">
              <span>Total</span>
              <span>R$ {totalPedido.toFixed(2)}</span>
            </div>
            <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={() => onNavigate('checkout')}>
              Prosseguir para Checkout
            </button>
            <button type="button" className="btn btn-ghost" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => onNavigate('cardapio')}>
              Continuar Comprando
            </button>
          </div>
        </div>
      )}
    </div>
  );
}