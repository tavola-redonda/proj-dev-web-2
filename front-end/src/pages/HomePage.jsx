export default function HomePage({ user, onNavigate }) {
  const features = [
    {
      icon: '🍗',
      title: 'Frango Crocante',
      description: 'Coxas, sobrecoxas e filés fritos na temperatura perfeita com tempero especial.',
    },
    {
      icon: '🥤',
      title: 'Bebidas Geladas',
      description: 'Refrigerantes, sucos naturais e cervejas estupidamente geladas.',
    },
    {
      icon: '🍰',
      title: 'Sobremesas',
      description: 'Doces deliciosos, tortas e pudins para fechar sua refeição com chave de ouro.',
    },
  ];

  return (
    <div className="hero fade-in">
      <h1>Delicioso frango crocante com <span>sabor inigualável</span></h1>
      <p>Faça seu pedido online, acompanhe a entrega em tempo real e aproveite o melhor sabor na Casa do Frango. Pratos preparados na hora, bebidas geladas e sobremesas incríveis.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        {user ? (
          <button type="button" className="btn btn-primary btn-lg" onClick={() => onNavigate('cardapio')}>Ver Cardápio</button>
        ) : (
          <>
            <button type="button" className="btn btn-primary btn-lg" onClick={() => onNavigate('login')}>Entrar na Conta</button>
            <button type="button" className="btn btn-outline btn-lg" onClick={() => onNavigate('cadastro')}>Criar Nova Conta</button>
          </>
        )}
      </div>

      <div style={{ marginTop: '4rem', padding: '2rem', background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
        {features.map((feature) => (
          <div key={feature.title}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{feature.icon}</div>
            <h3 style={{ fontWeight: 700, color: 'var(--secondary)' }}>{feature.title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}