package controller;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter("/*") // Aplica para todas as URLs do sistema
public class CorsFilter implements Filter {
    
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletResponse res = (HttpServletResponse) response;
        
        // Cabeçalhos que permitem o React (mesmo hospedado no GitHub) acessar o Tomcat local
        res.setHeader("Access-Control-Allow-Origin", "*"); 
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        
        chain.doFilter(request, response);
    }
}