export default function LoginPage({ loginEmail, setLoginEmail, loginSenha, setLoginSenha, onSubmit, onNavigate }) {
  return (
    <div className="form-card scale-in">
      <h2 className="form-title">Bem-vindo de volta!</h2>
      <p className="form-subtitle">Informe suas credenciais para fazer pedidos</p>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>E-mail</label>
          <input
            type="email"
            className="form-input"
            value={loginEmail}
            onChange={(event) => setLoginEmail(event.target.value)}
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
            onChange={(event) => setLoginSenha(event.target.value)}
            placeholder="Sua senha secreta"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Entrar</button>
      </form>
      <p className="form-link">
        Não tem uma conta? <span onClick={() => onNavigate('cadastro')}>Cadastre-se aqui</span>
      </p>
    </div>
  );
}