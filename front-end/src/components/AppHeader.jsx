function BrandMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
      <path d="M12 2c5.522 0 10 4.477 10 10s-4.478 10-10 10S2 17.523 2 12 6.478 2 12 2Z" />
      <path d="M12 6v12M6 12h12" />
    </svg>
  );
}

export default function AppHeader({ user, cartCount, onNavigate, onLogout }) {
  return (
    <header className="header">
      <button type="button" className="brand brand-button" onClick={() => onNavigate('home')}>
        <BrandMark />
        Casa do <span>Frango</span>
      </button>

      <nav className="nav-links">
        <button type="button" className="btn btn-ghost" onClick={() => onNavigate('home')}>Início</button>

        {user ? (
          <>
            <button type="button" className="btn btn-ghost" onClick={() => onNavigate('cardapio')}>Cardápio</button>
            <button type="button" className="btn btn-ghost" onClick={() => onNavigate('historico')}>Meus Pedidos</button>
            <button type="button" className="btn btn-ghost" onClick={() => onNavigate('carrinho')}>
              Carrinho
              {cartCount > 0 && <span className="badge" style={{ marginLeft: '0.4rem' }}>{cartCount}</span>}
            </button>
            <div className="user-chip">
              <span>Olá,</span>
              <strong>{user.nome}</strong>
            </div>
            <button type="button" className="btn btn-outline" onClick={() => onNavigate('perfil')}>Perfil</button>
            <button type="button" className="btn btn-secondary" onClick={onLogout}>Sair</button>
          </>
        ) : (
          <>
            <button type="button" className="btn btn-outline" onClick={() => onNavigate('login')}>Entrar</button>
            <button type="button" className="btn btn-primary" onClick={() => onNavigate('cadastro')}>Cadastrar-se</button>
          </>
        )}
      </nav>
    </header>
  );
}