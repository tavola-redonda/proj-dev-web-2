const BASE_URL = 'http://localhost:8080/proj_dev_web';

// Helper to construct query params or form data
function toParams(data) {
  const params = new URLSearchParams();
  for (const key in data) {
    if (data[key] !== undefined && data[key] !== null) {
      params.append(key, data[key]);
    }
  }
  return params;
}

export async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const defaultHeaders = {};

  if (options.body && !(options.body instanceof FormData) && !(options.body instanceof URLSearchParams)) {
    defaultHeaders['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Crucial to send/receive JSESSIONID cookie
  });

  if (response.status === 401) {
    return { success: false, unauthorized: true, message: 'Não autenticado' };
  }

 if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.erro || errorData.message || 'Erro no servidor');
  }

  return response.json();
}

export const api = {
  // Session / Authentication
  getSession: () => request('/login', { method: 'GET' }),
  login: (email, senha) => request('/login', {
    method: 'POST',
    body: toParams({ email, senha }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  logout: () => request('/logout', { method: 'GET' }),
  cadastro: (data) => request('/cadastro', {
    method: 'POST',
    body: toParams(data),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),

  // Catalog
  getCardapio: () => request('/cardapio', { method: 'GET' }),
  adicionarAoCarrinho: (id, quantidade) => request('/cardapio', {
    method: 'POST',
    body: toParams({ id, quantidade }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),

  // Cart
  getCarrinho: () => request('/Carrinho', { method: 'GET' }),
  removerCarrinhoItem: (id) => request('/Carrinho', {
    method: 'POST',
    body: toParams({ acao: 'remove', id }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  adicionarCarrinhoItem: (id) => request('/Carrinho', {
    method: 'POST',
    body: toParams({ acao: 'add', id }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),

  // Checkout
  getCheckoutInfo: () => request('/checkout', { method: 'GET' }),
  finalizarPedido: (enderecoEntrega) => request('/checkout', {
    method: 'POST',
    body: toParams({ enderecoEntrega }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),

  // Profile
  getPerfil: () => request('/perfil', { method: 'GET' }),
  atualizarPerfil: (nome, endereco) => request('/perfil', {
    method: 'POST',
    body: toParams({ nome, endereco }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),

  // Order History
  getHistorico: () => request('/historico-pedidos', { method: 'GET' })
};
