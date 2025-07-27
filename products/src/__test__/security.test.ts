import dotenv from "dotenv";
dotenv.config({ path: `.env.development` }); // 👈 fuerza cargar el archivo correcto

import request from "supertest";
import app from "../app"; // Asegúrate que apunta a tu app Express

describe("Ruta protegida /inicio", () => {
  it("debería rechazar el acceso sin token", async () => {
    const res = await request(app).get("/inicio");
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/no token provided/i);
  });

  it("debería rechazar el acceso con token inválido", async () => {
    const res = await request(app)
      .get("/inicio")
      .set("Cookie", "token=tokenInvalido");
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/token inválido/i);
  });

  it("debería rechazar el acceso con token expirado", async () => {
    // Genera un token expirado manualmente o mockéalo según tu setup
    const expiredToken = "tokenExpiradoFake"; // Aquí debería ir un token JWT expirado real para el test
    const res = await request(app)
      .get("/inicio")
      .set("Cookie", `token=${expiredToken}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/token inválido/i);
  });
});
