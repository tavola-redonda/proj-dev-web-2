export default function CategoryTabs({ categories, activeCategory, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`btn ${activeCategory === category ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => onChange(category)}
          style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.25rem' }}
        >
          {category}
        </button>
      ))}
    </div>
  );
}