package model;

public class User {
	private int id;
	private String nome;
	private String telefone;
	private String email;
	private String senha_hash;
	private String endereco;
	private Boolean is_admin;

	
	public User() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
	
	public User(int id, String nome, String telefone, String email, String senha_hash, Boolean is_admin) {
		super();
		this.id = id;
		this.nome = nome;
		this.telefone = telefone;
		this.email = email;
		this.senha_hash = senha_hash;
		this.setIs_admin(is_admin);

	}



	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getTeleFone() {
		return telefone;
	}

	public String getTelefone() {
		return telefone;
	}
	public void setTelefone(String telefone) {
		this.telefone = telefone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}



	public String getSenha_hash() {
		return senha_hash;
	}

	public String getSenhaHash() {
		return senha_hash;
	}



	public void setSenha_hash(String senha_hash) {
		this.senha_hash = senha_hash;
	}

	public void setSenhaHash(String senhaHash) {
		this.senha_hash = senhaHash;
	}



	public String getEndereco() {
		return endereco;
	}



	public void setEndereco(String endereco) {
		this.endereco = endereco;
	}



	public Boolean getIs_admin() {
		return is_admin;
	}



	public void setIs_admin(Boolean is_admin) {
		this.is_admin = is_admin;
	}




}
