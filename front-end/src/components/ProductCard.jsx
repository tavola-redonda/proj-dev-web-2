import { useState } from 'react';

function getProductIcon(category) {
  if (category === 'Bebidas') return '🥤';
  if (category === 'Sobremesas') return '🍰';
  return '🍗';
}

export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = async () => {
    await onAddToCart(product.id, quantity);
    setQuantity(1);
  };

  return (
    <div className="card">
      <div>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          {getProductIcon(product.categoria)}
        </div>
        <h3>{product.nome}</h3>
        <p>{product.descricao}</p>
      </div>
      <div>
        <span className="price">R$ {product.preco.toFixed(2)}</span>
        <div className="card-footer">
          <label className="quantity-control">
            <span className="helper">Quantidade</span>
            <input
              className="quantity-input"
              type="number"
              min="1"
              max="20"
              value={quantity}
              onChange={(event) => setQuantity(Math.max(1, parseInt(event.target.value, 10) || 1))}
            />
          </label>
          <button type="button" className="btn btn-primary" onClick={handleAdd}>
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}