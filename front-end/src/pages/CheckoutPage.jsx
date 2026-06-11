export default function CheckoutPage({ cart = [], totalPedido = 0, checkoutEndereco, setCheckoutEndereco, onSubmit }) {
  // Escudos contra dados indefinidos
  const safeCart = Array.isArray(cart) ? cart : [];
  const safeTotal = Number(totalPedido) || 0;

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="section-title">Finalizar Pedido</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--secondary)' }}>Endereço de Entrega</h3>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Endereço Completo</label>
              <textarea
                className="form-input"
                rows="4"
                value={checkoutEndereco}
                onChange={(event) => setCheckoutEndereco(event.target.value)}
                placeholder="Ex: Rua das Flores, 123, Apto 456, Bairro Centro, Niterói - RJ"
                style={{ resize: 'vertical', width: '100%', fontFamily: 'inherit' }}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Confirmar e Finalizar Compra
            </button>
          </form>
        </div>

        <div className="cart-summary" style={{ margin: 0 }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--secondary)' }}>Produtos no Pedido</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            {safeCart.map((item) => {
              // Mapeamento inteligente para evitar quebra de tela
              const idSeguro = item?.produto?.id || item?.id || item?.idProduto || item?.produtoId || item?.id_produto;
              const nomeSeguro = item?.produto?.nome || item?.nome || 'Produto';
              const subtotalSeguro = Number(item?.subtotal) || 0;

              return (
                <div key={idSeguro || Math.random()} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item?.quantidade || 1}x {nomeSeguro}</span>
                  <span style={{ fontWeight: 600 }}>R$ {subtotalSeguro.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
          <div className="summary-row summary-row-total" style={{ margin: 0, padding: 0, border: 'none' }}>
            <span>Total</span>
            <span>R$ {safeTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}