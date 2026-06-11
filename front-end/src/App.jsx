import { useState, useEffect } from 'react';
import { api } from './api';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // home, cardapio, carrinho, checkout, login, cadastro, perfil, historico
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [totalPedido, setTotalPedido] = useState(0);
  const [produtos, setProdutos] = useState([]);
  const [historico, setHistorico] = useState([]);
  
  // App state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Filter for catalog
  const [activeCategory, setActiveCategory] = useState('Todos');

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  
  const [registerNome, setRegisterNome] = useState('');
  const [registerTelefone, setRegisterTelefone] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerEndereco, setRegisterEndereco] = useState('');
  const [registerSenha, setRegisterSenha] = useState('');
  const [registerConfirmarSenha, setRegisterConfirmarSenha] = useState('');

  const [profileNome, setProfileNome] = useState('');
  const [profileEndereco, setProfileEndereco] = useState('');

  const [checkoutEndereco, setCheckoutEndereco] = useState('');

  // Auto-dismiss alerts
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Check user session on startup
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);
      const res = await api.getSession();
      if (res.success) {
        setUser(res.usuarioLogado);
        setCart(res.carrinho || []);
        setTotalPedido(res.totalPedido || 0);
      }
    } catch (e) {
      console.error('Failed to get session:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginSenha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    try {
      setLoading(true);
      const res = await api.login(loginEmail, loginSenha);
      if (res.success) {
        setUser(res.usuarioLogado);
        setSuccessMsg('Login realizado com sucesso!');
        // Refresh cart
        const cartRes = await api.getCarrinho();
        if (cartRes.success) {
          setCart(cartRes.carrinho || []);
          setTotalPedido(cartRes.totalPedido || 0);
        }
        setLoginEmail('');
        setLoginSenha('');
        setCurrentPage('cardapio');
        fetchCardapio();
      } else {
        setError(res.message || 'E-mail ou senha incorretos.');
      }
    } catch (e) {
      setError('Erro ao realizar o login.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await api.logout();
      if (res.success) {
        setUser(null);
        setCart([]);
        setTotalPedido(0);
        setSuccessMsg('Sessão encerrada.');
        setCurrentPage('home');
      }
    } catch (e) {
      setError('Erro ao sair.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerNome || !registerEmail || !registerSenha) {
      setError('Preencha nome, email e senha.');
      return;
    }
    if (registerSenha !== registerConfirmarSenha) {
      setError('A senha e a confirmação não conferem.');
      return;
    }
    if (registerSenha.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    try {
      setLoading(true);
      const res = await api.cadastro({
        nome: registerNome,
        telefone: registerTelefone,
        email: registerEmail,
        endereco: registerEndereco,
        senha: registerSenha,
        confirmarSenha: registerConfirmarSenha
      });
      if (res.success) {
        setSuccessMsg('Cadastro realizado com sucesso! Faça login.');
        // Clean fields
        setRegisterNome('');
        setRegisterTelefone('');
        setRegisterEmail('');
        setRegisterEndereco('');
        setRegisterSenha('');
        setRegisterConfirmarSenha('');
        setCurrentPage('login');
      } else {
        setError(res.message || 'Erro ao realizar cadastro.');
      }
    } catch (e) {
      setError('Erro ao realizar o cadastro.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCardapio = async () => {
    try {
      setLoading(true);
      const res = await api.getCardapio();
      if (res.unauthorized) {
        setUser(null);
        setCurrentPage('login');
      } else {
        // CORREÇÃO DA COMUNICAÇÃO: 
        // O Java manda um Dicionário (Map) agrupado por categorias.
        // Precisamos extrair apenas os valores (as listas de produtos) e achatar (flat) 
        // em uma única lista para o filtro do React funcionar.
        const arrayDeProdutos = Object.values(res).flat();
        setProdutos(arrayDeProdutos);
      }
    } catch (e) {
      setError('Erro ao carregar o cardápio.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (produtoId, qty) => {
    try {
      setLoading(true);
      const res = await api.adicionarAoCarrinho(produtoId, qty);
      if (res.success) {
        setCart(res.carrinho || []);
        setTotalPedido(res.totalPedido || 0);
        setSuccessMsg('Item adicionado ao carrinho!');
      } else {
        setError(res.message || 'Erro ao adicionar item.');
      }
    } catch (e) {
      setError('Erro ao adicionar produto.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCartItem = async (produtoId, action) => {
    try {
      setLoading(true);
      let res;
      if (action === 'add') {
        res = await api.adicionarCarrinhoItem(produtoId);
      } else if (action === 'sub') {
        res = await api.removerCarrinhoItem(produtoId); // sub decrement
      } else {
        res = await api.removerCarrinhoItem(produtoId); // remove
      }
      if (res.success) {
        setCart(res.carrinho || []);
        setTotalPedido(res.totalPedido || 0);
        setSuccessMsg('Carrinho atualizado.');
      } else {
        setError(res.message || 'Erro ao atualizar carrinho.');
      }
    } catch (e) {
      setError('Erro ao atualizar item do carrinho.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCheckout = async () => {
    try {
      setLoading(true);
      const res = await api.getCheckoutInfo();
      if (res.unauthorized) {
        setUser(null);
        setCurrentPage('login');
      } else if (res.success) {
        setCheckoutEndereco(res.usuario.endereco || '');
      }
    } catch (e) {
      setError('Erro ao carregar dados de checkout.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!checkoutEndereco.trim()) {
      setError('O endereço de entrega é obrigatório.');
      return;
    }
    try {
      setLoading(true);
      const res = await api.finalizarPedido(checkoutEndereco);
      if (res.success) {
        setCart([]);
        setTotalPedido(0);
        setSuccessMsg(`Pedido #${res.pedidoId} finalizado com sucesso!`);
        setCurrentPage('historico');
        fetchHistorico();
      } else {
        setError(res.message || 'Erro ao finalizar o pedido.');
      }
    } catch (e) {
      setError('Erro ao concluir o pedido.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.getPerfil();
      if (res.unauthorized) {
        setUser(null);
        setCurrentPage('login');
      } else if (res.success) {
        setProfileNome(res.usuario.nome || '');
        setProfileEndereco(res.usuario.endereco || '');
      }
    } catch (e) {
      setError('Erro ao carregar perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileNome.trim()) {
      setError('O nome é obrigatório.');
      return;
    }
    try {
      setLoading(true);
      const res = await api.atualizarPerfil(profileNome, profileEndereco);
      if (res.success) {
        setUser(res.usuario);
        setSuccessMsg('Perfil atualizado com sucesso!');
      } else {
        setError(res.message || 'Erro ao atualizar perfil.');
      }
    } catch (e) {
      setError('Erro ao salvar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistorico = async () => {
    try {
      setLoading(true);
      const res = await api.getHistorico();
      if (res.unauthorized) {
        setUser(null);
        setCurrentPage('login');
      } else {
        setHistorico(res || []);
      }
    } catch (e) {
      setError('Erro ao buscar histórico de pedidos.');
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    if (page === 'cardapio') fetchCardapio();
    if (page === 'carrinho') fetchCart();
    if (page === 'checkout') fetchCheckout();
    if (page === 'perfil') fetchProfile();
    if (page === 'historico') fetchHistorico();
  };

  const categories = ['Todos', 'Pratos principais', 'Bebidas', 'Sobremesas'];
  const filteredProducts = activeCategory === 'Todos' 
    ? produtos 
    : produtos.filter(p => p.categoria === activeCategory);

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <header className="header">
        <div className="brand" onClick={() => navigateTo('home')}>
          {/* Fried Chicken Icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--primary)'}}>
            <path d="M12 2c5.522 0 10 4.477 10 10s-4.478 10-10 10S2 17.523 2 12 6.478 2 12 2Z"/>
            <path d="M12 6v12M6 12h12"/>
          </svg>
          Casa do <span>Frango</span>
        </div>
        <nav className="nav-links">
          <button className="btn btn-ghost" onClick={() => navigateTo('home')}>Início</button>
          
          {user ? (
            <>
              <button className="btn btn-ghost" onClick={() => navigateTo('cardapio')}>Cardápio</button>
              <button className="btn btn-ghost" onClick={() => navigateTo('historico')}>Meus Pedidos</button>
              <button className="btn btn-ghost" onClick={() => navigateTo('carrinho')}>
                Carrinho
                {cart.length > 0 && <span className="badge" style={{marginLeft: '0.4rem'}}>{cart.reduce((a, b) => a + b.quantidade, 0)}</span>}
              </button>
              <div className="user-chip">
                <span>Olá,</span>
                <strong>{user.nome}</strong>
              </div>
              <button className="btn btn-outline" onClick={() => navigateTo('perfil')}>Perfil</button>
              <button className="btn btn-secondary" onClick={handleLogout}>Sair</button>
            </>
          ) : (
            <>
              <button className="btn btn-outline" onClick={() => navigateTo('login')}>Entrar</button>
              <button className="btn btn-primary" onClick={() => navigateTo('cadastro')}>Cadastrar-se</button>
            </>
          )}
        </nav>
      </header>

      {/* Global Alerts */}
      <div style={{maxWidth: '1200px', width: '100%', margin: '1rem auto 0 auto', padding: '0 2rem'}}>
        {error && (
          <div className="alert alert-danger fade-in">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}
        {successMsg && (
          <div className="alert alert-success fade-in">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            {successMsg}
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(255, 255, 255, 0.7)', display: 'flex', 
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            width: '40px', height: '40px', border: '4px solid var(--border)', 
            borderTopColor: 'var(--primary)', borderRadius: '50%', 
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Content Pages */}
      <main className="main-content">
        
        {/* PAGE: HOME */}
        {currentPage === 'home' && (
          <div className="hero fade-in">
            <h1>Delicioso frango crocante com <span>sabor inigualável</span></h1>
            <p>Faça seu pedido online, acompanhe a entrega em tempo real e aproveite o melhor sabor na Casa do Frango. Pratos preparados na hora, bebidas geladas e sobremesas incríveis.</p>
            <div style={{display: 'flex', justifyContent: 'center', gap: '1rem'}}>
              {user ? (
                <button className="btn btn-primary btn-lg" onClick={() => navigateTo('cardapio')}>Ver Cardápio</button>
              ) : (
                <>
                  <button className="btn btn-primary btn-lg" onClick={() => navigateTo('login')}>Entrar na Conta</button>
                  <button className="btn btn-outline btn-lg" onClick={() => navigateTo('cadastro')}>Criar Nova Conta</button>
                </>
              )}
            </div>
            
            {/* Visual representation card */}
            <div style={{
              marginTop: '4rem', padding: '2rem', background: '#fff', 
              borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem'
            }}>
              <div>
                <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>🍗</div>
                <h3 style={{fontWeight: 700, color: 'var(--secondary)'}}>Frango Crocante</h3>
                <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Coxas, sobrecoxas e filés fritos na temperatura perfeita com tempero especial.</p>
              </div>
              <div>
                <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>🥤</div>
                <h3 style={{fontWeight: 700, color: 'var(--secondary)'}}>Bebidas Geladas</h3>
                <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Refrigerantes, sucos naturais e cervejas estupidamente geladas.</p>
              </div>
              <div>
                <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>🍰</div>
                <h3 style={{fontWeight: 700, color: 'var(--secondary)'}}>Sobremesas</h3>
                <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Doces deliciosos, tortas e pudins para fechar sua refeição com chave de ouro.</p>
              </div>
            </div>
          </div>
        )}

        {/* PAGE: LOGIN */}
        {currentPage === 'login' && (
          <div className="form-card scale-in">
            <h2 className="form-title">Bem-vindo de volta!</h2>
            <p className="form-subtitle">Informe suas credenciais para fazer pedidos</p>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>E-mail</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)} 
                  placeholder="exemplo@email.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Senha</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={loginSenha} 
                  onChange={(e) => setLoginSenha(e.target.value)} 
                  placeholder="Sua senha secreta"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>Entrar</button>
            </form>
            <p className="form-link">
              Não tem uma conta? <span onClick={() => navigateTo('cadastro')}>Cadastre-se aqui</span>
            </p>
          </div>
        )}

        {/* PAGE: CADASTRO */}
        {currentPage === 'cadastro' && (
          <div className="form-card scale-in" style={{maxWidth: '500px'}}>
            <h2 className="form-title">Crie sua Conta</h2>
            <p className="form-subtitle">Cadastre-se rapidamente para realizar compras</p>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Nome Completo *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={registerNome} 
                  onChange={(e) => setRegisterNome(e.target.value)} 
                  placeholder="Como gostaria de ser chamado"
                  required
                />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={registerTelefone} 
                  onChange={(e) => setRegisterTelefone(e.target.value)} 
                  placeholder="(XX) XXXXX-XXXX"
                />
              </div>
              <div className="form-group">
                <label>E-mail *</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={registerEmail} 
                  onChange={(e) => setRegisterEmail(e.target.value)} 
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Endereço de Entrega Padrão</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={registerEndereco} 
                  onChange={(e) => setRegisterEndereco(e.target.value)} 
                  placeholder="Rua, Número, Bairro, Cidade"
                />
              </div>
              <div className="form-group">
                <label>Senha (mín. 6 caracteres) *</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={registerSenha} 
                  onChange={(e) => setRegisterSenha(e.target.value)} 
                  placeholder="Mínimo 6 dígitos"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirmar Senha *</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={registerConfirmarSenha} 
                  onChange={(e) => setRegisterConfirmarSenha(e.target.value)} 
                  placeholder="Digite a senha novamente"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>Criar Conta</button>
            </form>
            <p className="form-link">
              Já tem uma conta? <span onClick={() => navigateTo('login')}>Faça login</span>
            </p>
          </div>
        )}

        {/* PAGE: CARDAPIO */}
        {currentPage === 'cardapio' && (
          <div className="fade-in">
            <div className="section-title">
              Cardápio Principal
              <span className="badge">{produtos.length} itens disponíveis</span>
            </div>
            
            {/* Category tabs */}
            <div style={{display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem'}}>
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setActiveCategory(cat)}
                  style={{borderRadius: 'var(--radius-full)', padding: '0.5rem 1.25rem'}}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filteredProducts.length === 0 ? (
              <div style={{textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)'}}>
                <p style={{color: 'var(--text-muted)'}}>Nenhum item encontrado nesta categoria.</p>
              </div>
            ) : (
              <div className="grid">
                {filteredProducts.map(p => {
                  // Track quantity input for each item in local state
                  const [qty, setQty] = useState(1);
                  return (
                    <div className="card" key={p.id}>
                      <div>
                        <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>
                          {p.categoria === 'Bebidas' ? '🥤' : p.categoria === 'Sobremesas' ? '🍰' : '🍗'}
                        </div>
                        <h3>{p.nome}</h3>
                        <p>{p.descricao}</p>
                      </div>
                      <div>
                        <span className="price">R$ {p.preco.toFixed(2)}</span>
                        <div className="card-footer">
                          <label className="quantity-control">
                            <span className="helper">Quantidade</span>
                            <input 
                              className="quantity-input" 
                              type="number" 
                              min="1" 
                              max="20" 
                              value={qty} 
                              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                            />
                          </label>
                          <button 
                            className="btn btn-primary"
                            onClick={() => handleAddToCart(p.id, qty)}
                          >
                            Adicionar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PAGE: CARRINHO */}
        {currentPage === 'carrinho' && (
          <div className="fade-in">
            <h2 className="section-title">Meu Carrinho</h2>
            
            {cart.length === 0 ? (
              <div style={{textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)'}}>
                <div style={{fontSize: '3.5rem', marginBottom: '1rem'}}>🛒</div>
                <h3 style={{marginBottom: '0.5rem', fontWeight: 700}}>Seu carrinho está vazio</h3>
                <p style={{color: 'var(--text-muted)', marginBottom: '1.5rem'}}>Navegue por nosso cardápio e adicione deliciosos frangos ao seu pedido!</p>
                <button className="btn btn-primary" onClick={() => navigateTo('cardapio')}>Ver Cardápio</button>
              </div>
            ) : (
              <div className="cart-layout">
                <div className="cart-list">
                  {cart.map(item => (
                    <div className="cart-item" key={item.produto.id}>
                      <div className="cart-item-info">
                        <h4>{item.produto.nome}</h4>
                        <p>{item.produto.categoria} | R$ {item.produto.preco.toFixed(2)} cada</p>
                      </div>
                      <div className="cart-item-actions">
                        <div className="cart-item-qty">
                          <button 
                            className="qty-btn"
                            onClick={() => handleUpdateCartItem(item.produto.id, 'sub')}
                          >
                            -
                          </button>
                          <span style={{fontWeight: 600, width: '20px', textAlign: 'center'}}>{item.quantidade}</span>
                          <button 
                            className="qty-btn"
                            onClick={() => handleUpdateCartItem(item.produto.id, 'add')}
                          >
                            +
                          </button>
                        </div>
                        <span style={{fontWeight: 700, minWidth: '80px', textAlign: 'right'}}>
                          R$ {item.subtotal.toFixed(2)}
                        </span>
                        <button 
                          className="btn btn-ghost"
                          style={{color: 'var(--danger)', padding: '0.4rem'}}
                          onClick={() => handleUpdateCartItem(item.produto.id, 'remove')}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <h3 style={{marginBottom: '1rem', fontWeight: 700, color: 'var(--secondary)'}}>Resumo da Compra</h3>
                  <div className="summary-row">
                    <span>Itens ({cart.reduce((a, b) => a + b.quantidade, 0)})</span>
                    <span>R$ {totalPedido.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Entrega</span>
                    <span style={{color: 'var(--success)', fontWeight: 600}}>Grátis</span>
                  </div>
                  <div className="summary-row summary-row-total">
                    <span>Total</span>
                    <span>R$ {totalPedido.toFixed(2)}</span>
                  </div>
                  <button 
                    className="btn btn-primary" 
                    style={{width: '100%'}}
                    onClick={() => navigateTo('checkout')}
                  >
                    Prosseguir para Checkout
                  </button>
                  <button 
                    className="btn btn-ghost" 
                    style={{width: '100%', marginTop: '0.5rem'}}
                    onClick={() => navigateTo('cardapio')}
                  >
                    Continuar Comprando
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PAGE: CHECKOUT */}
        {currentPage === 'checkout' && (
          <div className="fade-in" style={{maxWidth: '800px', margin: '0 auto'}}>
            <h2 className="section-title">Finalizar Pedido</h2>
            <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem'}}>
              <div style={{background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem'}}>
                <h3 style={{fontWeight: 700, marginBottom: '1rem', color: 'var(--secondary)'}}>Endereço de Entrega</h3>
                <form onSubmit={handleCheckout}>
                  <div className="form-group">
                    <label>Endereço Completo</label>
                    <textarea 
                      className="form-input" 
                      rows="4" 
                      value={checkoutEndereco}
                      onChange={(e) => setCheckoutEndereco(e.target.value)}
                      placeholder="Ex: Rua das Flores, 123, Apto 456, Bairro Centro, Niterói - RJ"
                      style={{resize: 'vertical', width: '100%', fontFamily: 'inherit'}}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>
                    Confirmar e Finalizar Compra
                  </button>
                </form>
              </div>

              <div className="cart-summary" style={{margin: 0}}>
                <h3 style={{fontWeight: 700, marginBottom: '1rem', color: 'var(--secondary)'}}>Produtos no Pedido</h3>
                <div style={{maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem'}}>
                  {cart.map(item => (
                    <div key={item.produto.id} style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                      <span style={{color: 'var(--text-muted)'}}>{item.quantidade}x {item.produto.nome}</span>
                      <span style={{fontWeight: 600}}>R$ {item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="summary-row summary-row-total" style={{margin: 0, padding: 0, border: 'none'}}>
                  <span>Total</span>
                  <span>R$ {totalPedido.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE: PROFILE */}
        {currentPage === 'perfil' && (
          <div className="form-card scale-in">
            <h2 className="form-title">Meu Perfil</h2>
            <p className="form-subtitle">Gerencie suas informações cadastrais</p>
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label>Nome Completo</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={profileNome} 
                  onChange={(e) => setProfileNome(e.target.value)} 
                  required
                />
              </div>
              <div className="form-group">
                <label>E-mail (Não alterável)</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={user ? user.email : ''} 
                  disabled 
                  style={{background: 'var(--surface-secondary)', color: 'var(--text-light)'}}
                />
              </div>
              <div className="form-group">
                <label>Endereço de Entrega Principal</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={profileEndereco} 
                  onChange={(e) => setProfileEndereco(e.target.value)} 
                  placeholder="Rua, Número, Bairro"
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1.5rem'}}>
                Salvar Alterações
              </button>
            </form>
          </div>
        )}

        {/* PAGE: HISTORICO PEDIDOS */}
        {currentPage === 'historico' && (
          <div className="fade-in" style={{maxWidth: '800px', margin: '0 auto'}}>
            <h2 className="section-title">Histórico de Pedidos</h2>
            {historico.length === 0 ? (
              <div style={{textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)'}}>
                <p style={{color: 'var(--text-muted)'}}>Você ainda não realizou nenhum pedido.</p>
              </div>
            ) : (
              historico.map(pedido => (
                <div className="order-card" key={pedido.id}>
                  <div className="order-header">
                    <span className="order-id">Pedido #{pedido.id}</span>
                    <span className="order-date">{pedido.criadoEm}</span>
                  </div>
                  
                  <div className="order-items">
                    {pedido.itens.map(item => (
                      <div className="order-item-detail" key={item.id}>
                        <span style={{color: 'var(--text)'}}>
                          {item.quantidade}x {item.nomeItem} 
                          <span style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}> ({item.categoriaItem})</span>
                        </span>
                        <span>R$ {item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div>
                      <span style={{fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block'}}>Endereço de entrega:</span>
                      <strong style={{fontSize: '0.9rem', color: 'var(--secondary)'}}>{pedido.enderecoEntrega}</strong>
                    </div>
                    <div>
                      <span style={{fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textAlign: 'right'}}>Valor Total:</span>
                      <span className="order-total">R$ {pedido.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '2rem', 
        borderTop: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.5)',
        color: 'var(--text-muted)', fontSize: '0.9rem'
      }}>
        © 2026 Casa do Frango. Todos os direitos reservados.
      </footer>
    </div>
  );
}
