package controller;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;

@WebFilter("/*") // Aplica para todas as URLs do sistema
public class CorsFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        // 1. O Passaporte: Autoriza a porta do React a falar com o Java
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        
        // 2. Os Métodos: Permite GET, POST e o OPTIONS (que o navegador usa para testar a rota)
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        
        // 3. Os Cabeçalhos: Permite envio de JSON e dados de formulário
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        
        // 4. Os Cookies: Isso é OBRIGATÓRIO para o JSESSIONID (o carrinho do usuário) não sumir
        response.setHeader("Access-Control-Allow-Credentials", "true");

        // O navegador sempre manda um ping chamado "OPTIONS" antes de enviar um POST.
        // Se for só o ping, a gente devolve um OK (200) e libera a passagem.
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // Se for requisição normal (GET/POST), deixa seguir para o Servlet
        chain.doFilter(req, res);
    }
}