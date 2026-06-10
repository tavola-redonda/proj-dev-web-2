package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import model.User;
import util.PasswordUtil;


public class UserDAO {

    public User buscarPorId(int id) {
        String sql = "SELECT * FROM usuarios WHERE id = ?";

        try (Connection con = ConnectionFactory.getConnection();
             PreparedStatement pst = con.prepareStatement(sql)) {
            pst.setInt(1, id);

            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    User u = new User();
                    u.setId(rs.getInt("id"));
                    u.setNome(rs.getString("nome"));
                    u.setEmail(rs.getString("email"));
                    u.setTelefone(rs.getString("telefone"));
                    u.setEndereco(rs.getString("endereco"));
                    u.setIs_admin(rs.getBoolean("is_admin"));
                    return u;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean emailJaCadastrado(String email) {
        String sql = "SELECT 1 FROM usuarios WHERE email = ?";
		
        try (Connection con = ConnectionFactory.getConnection();
             PreparedStatement pst = con.prepareStatement(sql)) {
			
            pst.setString(1, email);
			
            try (ResultSet rs = pst.executeQuery()) {
                return rs.next();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean criarUsuario(User usuario) {
        String sql = "INSERT INTO usuarios (nome, telefone, email, senha_hash, endereco, is_admin) VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection con = ConnectionFactory.getConnection();
             PreparedStatement pst = con.prepareStatement(sql)) {

            pst.setString(1, usuario.getNome());
            pst.setString(2, usuario.getTelefone());
            pst.setString(3, usuario.getEmail());
            pst.setString(4, usuario.getSenhaHash());
            pst.setString(5, usuario.getEndereco());
            pst.setBoolean(6, Boolean.TRUE.equals(usuario.getIs_admin()));

            return pst.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean atualizarPerfil(User usuario) {
        String sql = "UPDATE usuarios SET nome = ?, endereco = ? WHERE id = ?";

        try (Connection con = ConnectionFactory.getConnection();
             PreparedStatement pst = con.prepareStatement(sql)) {

            pst.setString(1, usuario.getNome());
            pst.setString(2, usuario.getEndereco());
            pst.setInt(3, usuario.getId());

            return pst.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
	
	public User validarLogin(String email, String senha) {
        String sql = "SELECT * FROM usuarios WHERE email = ?";

        try (Connection con = ConnectionFactory.getConnection();
             PreparedStatement pst = con.prepareStatement(sql)) {

            pst.setString(1, email);

            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    String senhaArmazenada = rs.getString("senha_hash");
                    if (!PasswordUtil.verifyPassword(senha, senhaArmazenada)) {
                        return null;
                    }

                    User u = new User();
                    u.setId(rs.getInt("id"));
                    u.setNome(rs.getString("nome"));
                    u.setEmail(rs.getString("email"));
                    u.setTelefone(rs.getString("telefone"));
                    u.setEndereco(rs.getString("endereco"));
                    u.setIs_admin(rs.getBoolean("is_admin"));

                    return u;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
	
}
