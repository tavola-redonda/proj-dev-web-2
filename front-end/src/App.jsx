import { useEffect, useState } from 'react';
import { api } from './api';
import AppHeader from './components/AppHeader.jsx';
import GlobalAlerts from './components/GlobalAlerts.jsx';
import LoadingOverlay from './components/LoadingOverlay.jsx';
import AppFooter from './components/AppFooter.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CadastroPage from './pages/CadastroPage.jsx';
import CardapioPage from './pages/CardapioPage.jsx';
import CarrinhoPage from './pages/CarrinhoPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import PerfilPage from './pages/PerfilPage.jsx';
import HistoricoPage from './pages/HistoricoPage.jsx';
import './App.css';

const categories = ['Todos', 'Pratos principais', 'Bebidas', 'Sobremesas'];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [totalPedido, setTotalPedido] = useState(0);
  const [produtos, setProdutos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
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

  useEffect(() => {
    if (!error) return undefined;

    const timer = window.setTimeout(() => setError(''), 4000);
    return () => window.clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!successMsg) return undefined;

    const timer = window.setTimeout(() => setSuccessMsg(''), 4000);
    return () => window.clearTimeout(timer);
  }, [successMsg]);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);
      const res = await api.getSession();
      if (res.autenticado) {
        setUser({ nome: res.nome, email: res.email });
        setCart(res.itens || []);
        setTotalPedido(res.totalPedido || 0);
      }
    } catch (exception) {
      console.error('Failed to get session:', exception);
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
        setCart([]);
        setTotalPedido(0);
        setProdutos([]);
        setHistorico([]);
        setCurrentPage('login');
      } else {
        const arrayDeProdutos = Object.values(res).flat();
        setProdutos(arrayDeProdutos);
      }
    } catch (exception) {
      setError('Erro ao carregar o cardápio.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCarrinho = async () => {
    try {
      setLoading(true);
      const res = await api.getCarrinho();
      if (res.unauthorized) {
        setUser(null);
        setCart([]);
        setTotalPedido(0);
        setCurrentPage('login');
      } else {
        setCart(res.itens || []);
        setTotalPedido(res.totalPedido || 0);
      }
    } catch (exception) {
      setError('Erro ao carregar o carrinho.');
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
      } else if (res.sucesso || res.success) { // Correção de compatibilidade
        setCheckoutEndereco(res.usuario?.endereco || '');
      }
    } catch (exception) {
      setError('Erro ao carregar dados de checkout.');
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
      } else if (res.sucesso || res.success) { // Correção de compatibilidade
        setProfileNome(res.usuario?.nome || '');
        setProfileEndereco(res.usuario?.endereco || '');
      }
    } catch (exception) {
      setError('Erro ao carregar perfil.');
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
    } catch (exception) {
      setError('Erro ao buscar histórico de pedidos.');
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = async (page) => {
    setCurrentPage(page);

    if (page === 'cardapio') {
      await fetchCardapio();
    }

    if (page === 'carrinho') {
      await fetchCarrinho();
    }

    if (page === 'checkout') {
      await fetchCheckout();
    }

    if (page === 'perfil') {
      await fetchProfile();
    }

    if (page === 'historico') {
      await fetchHistorico();
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!loginEmail || !loginSenha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.login(loginEmail, loginSenha);

      if (res.sucesso) {
        setUser(res.usuario);
        setSuccessMsg('Login realizado com sucesso!');

        const cartRes = await api.getCarrinho();
        if (!cartRes.erro) { // Garante que o fetch do carrinho não falhou
           setCart(cartRes.itens || []);
           setTotalPedido(cartRes.totalPedido || 0);
        }

        setLoginEmail('');
        setLoginSenha('');
        await navigateTo('cardapio');
      } else {
        setError(res.erro || 'E-mail ou senha incorretos.');
      }
    } catch (exception) {
      setError('Erro ao realizar o login.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await api.logout();

      if (res.sucesso || res.success) { // Correção de compatibilidade
        setUser(null);
        setCart([]);
        setTotalPedido(0);
        setProdutos([]);
        setHistorico([]);
        setActiveCategory('Todos');
        setSuccessMsg('Sessão encerrada.');
        setCurrentPage('login');
      }
    } catch (exception) {
      setError('Erro ao sair.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

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
        confirmarSenha: registerConfirmarSenha,
      });

      if (res.sucesso || res.success) { // Correção de compatibilidade
        setSuccessMsg('Cadastro realizado com sucesso! Faça login.');
        setRegisterNome('');
        setRegisterTelefone('');
        setRegisterEmail('');
        setRegisterEndereco('');
        setRegisterSenha('');
        setRegisterConfirmarSenha('');
        setCurrentPage('login');
      } else {
        setError(res.erro || res.message || 'Erro ao realizar cadastro.');
      }
    } catch (exception) {
      setError('Erro ao realizar o cadastro.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (produtoId, quantity) => {
    try {
      setLoading(true);
      const res = await api.adicionarAoCarrinho(produtoId, quantity);

      if (!res.erro) {
        setCart(res.itens || []);
        setTotalPedido(res.totalPedido || 0);
        setSuccessMsg('Item adicionado ao carrinho!');
      } else {
        setError(res.erro || 'Erro ao adicionar item.');
      }
    } catch (exception) {
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
      } else {
        res = await api.removerCarrinhoItem(produtoId);
      }

      if (!res.erro) {
        setCart(res.itens || []);
        setTotalPedido(res.totalPedido || 0);
        setSuccessMsg('Carrinho atualizado.');
      } else {
        setError(res.erro || 'Erro ao atualizar carrinho.');
      }
    } catch (exception) {
      setError('Erro ao atualizar item do carrinho.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckout = async (event) => {
    event.preventDefault();

    if (!checkoutEndereco.trim()) {
      setError('O endereço de entrega é obrigatório.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.finalizarPedido(checkoutEndereco);

      if (res.sucesso || res.success) { // Correção de compatibilidade
        setCart([]);
        setTotalPedido(0);
        setSuccessMsg(`Pedido #${res.pedidoId} finalizado com sucesso!`);
        setCurrentPage('historico');
        await fetchHistorico();
      } else {
        setError(res.erro || res.message || 'Erro ao finalizar o pedido.');
      }
    } catch (exception) {
      setError('Erro ao concluir o pedido.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    if (!profileNome.trim()) {
      setError('O nome é obrigatório.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.atualizarPerfil(profileNome, profileEndereco);

      if (res.sucesso || res.success) { // Correção de compatibilidade
        setUser(res.usuario);
        setSuccessMsg('Perfil atualizado com sucesso!');
      } else {
        setError(res.erro || res.message || 'Erro ao atualizar perfil.');
      }
    } catch (exception) {
      setError('Erro ao salvar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage
            loginEmail={loginEmail}
            setLoginEmail={setLoginEmail}
            loginSenha={loginSenha}
            setLoginSenha={setLoginSenha}
            onSubmit={handleLogin}
            onNavigate={navigateTo}
          />
        );
      case 'cadastro':
        return (
          <CadastroPage
            registerNome={registerNome}
            setRegisterNome={setRegisterNome}
            registerTelefone={registerTelefone}
            setRegisterTelefone={setRegisterTelefone}
            registerEmail={registerEmail}
            setRegisterEmail={setRegisterEmail}
            registerEndereco={registerEndereco}
            setRegisterEndereco={setRegisterEndereco}
            registerSenha={registerSenha}
            setRegisterSenha={setRegisterSenha}
            registerConfirmarSenha={registerConfirmarSenha}
            setRegisterConfirmarSenha={setRegisterConfirmarSenha}
            onSubmit={handleRegister}
            onNavigate={navigateTo}
          />
        );
      case 'cardapio':
        return (
          <CardapioPage
            products={produtos}
            categories={categories}
            activeCategory={activeCategory}
            onChangeCategory={setActiveCategory}
            onAddToCart={handleAddToCart}
          />
        );
      case 'carrinho':
        return (
          <CarrinhoPage
            cart={cart}
            totalPedido={totalPedido}
            onUpdateCartItem={handleUpdateCartItem}
            onNavigate={navigateTo}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage
            cart={cart}
            totalPedido={totalPedido}
            checkoutEndereco={checkoutEndereco}
            setCheckoutEndereco={setCheckoutEndereco}
            onSubmit={handleCheckout}
          />
        );
      case 'perfil':
        return (
          <PerfilPage
            user={user}
            profileNome={profileNome}
            setProfileNome={setProfileNome}
            profileEndereco={profileEndereco}
            setProfileEndereco={setProfileEndereco}
            onSubmit={handleUpdateProfile}
          />
        );
      case 'historico':
        return <HistoricoPage historico={historico} />;
      case 'home':
      default:
        return <HomePage user={user} onNavigate={navigateTo} />;
    }
  };

  const cartCount = cart.reduce((accumulator, item) => accumulator + item.quantidade, 0);

  return (
    <div className="app-container">
      <AppHeader user={user} cartCount={cartCount} onNavigate={navigateTo} onLogout={handleLogout} />
      <GlobalAlerts error={error} successMsg={successMsg} />
      <LoadingOverlay loading={loading} />

      <main className="main-content">
        {renderPage()}
      </main>

      <AppFooter />
    </div>
  );
}