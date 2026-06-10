package util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.Base64;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public final class PasswordUtil {

	private static final String ALGORITHM = "PBKDF2WithHmacSHA256";
	private static final int ITERATIONS = 120000;
	private static final int SALT_LENGTH = 16;
	private static final int KEY_LENGTH = 256;
	private static final SecureRandom RANDOM = new SecureRandom();

	private PasswordUtil() {
	}

	public static String hashPassword(String plainPassword) {
		if (plainPassword == null || plainPassword.isBlank()) {
			throw new IllegalArgumentException("Senha invalida");
		}

		byte[] salt = new byte[SALT_LENGTH];
		RANDOM.nextBytes(salt);
		byte[] hash = pbkdf2(plainPassword.toCharArray(), salt, ITERATIONS, KEY_LENGTH);

		return String.join("$",
			"pbkdf2_sha256",
			String.valueOf(ITERATIONS),
			Base64.getEncoder().encodeToString(salt),
			Base64.getEncoder().encodeToString(hash));
	}

	public static boolean verifyPassword(String plainPassword, String storedPassword) {
		if (plainPassword == null || storedPassword == null) {
			return false;
		}

		if (!storedPassword.startsWith("pbkdf2_sha256$") ) {
			return plainPassword.equals(storedPassword);
		}

		String[] parts = storedPassword.split("\\$");
		if (parts.length != 4) {
			return false;
		}

		try {
			int iterations = Integer.parseInt(parts[1]);
			byte[] salt = Base64.getDecoder().decode(parts[2]);
			byte[] expected = Base64.getDecoder().decode(parts[3]);
			byte[] actual = pbkdf2(plainPassword.toCharArray(), salt, iterations, expected.length * 8);
			return MessageDigest.isEqual(expected, actual);
		} catch (IllegalArgumentException e) {
			return false;
		}
	}

	private static byte[] pbkdf2(char[] password, byte[] salt, int iterations, int keyLength) {
		KeySpec spec = new PBEKeySpec(password, salt, iterations, keyLength);
		try {
			SecretKeyFactory factory = SecretKeyFactory.getInstance(ALGORITHM);
			return factory.generateSecret(spec).getEncoded();
		} catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
			throw new IllegalStateException("Nao foi possivel criptografar a senha", e);
		}
	}
}