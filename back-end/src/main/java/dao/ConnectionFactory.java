package dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


public class ConnectionFactory {

	
	private static final String DRIVER = "com.mysql.cj.jdbc.Driver";
    private static final String URL = getEnv("DB_URL", "jdbc:mysql://127.0.0.1:3306/dbteste?useTimezone=true&serverTimezone=UTC");
    private static final String USER = getEnv("DB_USER", "app");
    private static final String PASS = getEnv("DB_PASS", "app123");
	
    
    public static Connection getConnection() {
        try {
            Class.forName(DRIVER);
            return DriverManager.getConnection(URL, USER, PASS);
        } catch (ClassNotFoundException | SQLException e) {
            throw new RuntimeException("Erro na conexão: ", e);
        }
    }

    private static String getEnv(String key, String fallback) {
        String value = System.getenv(key);
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value;
    }
}
