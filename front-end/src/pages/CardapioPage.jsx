import CategoryTabs from '../components/CategoryTabs.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function CardapioPage({ products, categories, activeCategory, onChangeCategory, onAddToCart }) {
  const filteredProducts = activeCategory === 'Todos'
    ? products
    : products.filter((product) => product.categoria === activeCategory);

  return (
    <div className="fade-in">
      <div className="section-title">
        Cardápio Principal
        <span className="badge">{products.length} itens disponíveis</span>
      </div>

      <CategoryTabs categories={categories} activeCategory={activeCategory} onChange={onChangeCategory} />

      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)' }}>Nenhum item encontrado nesta categoria.</p>
        </div>
      ) : (
        <div className="grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}