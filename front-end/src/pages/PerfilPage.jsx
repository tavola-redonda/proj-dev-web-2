export default function PerfilPage({ user, profileNome, setProfileNome, profileEndereco, setProfileEndereco, onSubmit }) {
  return (
    <div className="form-card scale-in">
      <h2 className="form-title">Meu Perfil</h2>
      <p className="form-subtitle">Gerencie suas informações cadastrais</p>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Nome Completo</label>
          <input
            type="text"
            className="form-input"
            value={profileNome}
            onChange={(event) => setProfileNome(event.target.value)}
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
            style={{ background: 'var(--surface-secondary)', color: 'var(--text-light)' }}
          />
        </div>
        <div className="form-group">
          <label>Endereço de Entrega Principal</label>
          <input
            type="text"
            className="form-input"
            value={profileEndereco}
            onChange={(event) => setProfileEndereco(event.target.value)}
            placeholder="Rua, Número, Bairro"
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}