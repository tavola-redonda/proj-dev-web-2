package controller;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import com.google.gson.JsonObject;

@WebServlet("/error")
public class ErrorServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Integer statusCode = (Integer) req.getAttribute("jakarta.servlet.error.status_code");
        if (statusCode == null) statusCode = 500;

        resp.setStatus(statusCode);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        JsonObject json = new JsonObject();
        json.addProperty("erro", statusCode == 404
                ? "Rota não encontrada"
                : "Erro interno no servidor");
        json.addProperty("status", statusCode);

        resp.getWriter().write(json.toString());
    }
}
