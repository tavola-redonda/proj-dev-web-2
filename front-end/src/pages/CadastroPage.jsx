export default function CadastroPage({
  registerNome,
  setRegisterNome,
  registerTelefone,
  setRegisterTelefone,
  registerEmail,
  setRegisterEmail,
  registerEndereco,
  setRegisterEndereco,
  registerSenha,
  setRegisterSenha,
  registerConfirmarSenha,
  setRegisterConfirmarSenha,
  onSubmit,
  onNavigate,
}) {
  return (
    <div className="form-card scale-in" style={{ maxWidth: '500px' }}>
      <h2 className="form-title">Crie sua Conta</h2>
      <p className="form-subtitle">Cadastre-se rapidamente para realizar compras</p>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Nome Completo *</label>
          <input type="text" className="form-input" value={registerNome} onChange={(event) => setRegisterNome(event.target.value)} placeholder="Como gostaria de ser chamado" required />
        </div>
        <div className="form-group">
          <label>Telefone</label>
          <input type="text" className="form-input" value={registerTelefone} onChange={(event) => setRegisterTelefone(event.target.value)} placeholder="(XX) XXXXX-XXXX" />
        </div>
        <div className="form-group">
          <label>E-mail *</label>
          <input type="email" className="form-input" value={registerEmail} onChange={(event) => setRegisterEmail(event.target.value)} placeholder="seu@email.com" required />
        </div>
        <div className="form-group">
          <label>Endereço de Entrega Padrão</label>
          <input type="text" className="form-input" value={registerEndereco} onChange={(event) => setRegisterEndereco(event.target.value)} placeholder="Rua, Número, Bairro, Cidade" />
        </div>
        <div className="form-group">
          <label>Senha (mín. 6 caracteres) *</label>
          <input type="password" className="form-input" value={registerSenha} onChange={(event) => setRegisterSenha(event.target.value)} placeholder="Mínimo 6 dígitos" required />
        </div>
        <div className="form-group">
          <label>Confirmar Senha *</label>
          <input type="password" className="form-input" value={registerConfirmarSenha} onChange={(event) => setRegisterConfirmarSenha(event.target.value)} placeholder="Digite a senha novamente" required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Criar Conta</button>
      </form>
      <p className="form-link">
        Já tem uma conta? <span onClick={() => onNavigate('login')}>Faça login</span>
      </p>
    </div>
  );
}