import dotenv from "dotenv";
dotenv.config({ path: `.env.development` }); // 👈 fuerza cargar el archivo correcto

import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe("Auth Controller", () => {
  describe("POST /auth/login", () => {
    it("debería loguearse correctamente con credenciales válidas", async () => {
      await request(app).post("/auth/register").send({
        email: "admin@mail.com",
        password: "admin123",
      });

      const res = await request(app).post("/auth/login").send({
        email: "admin@mail.com",
        password: "admin123",
      });

      expect(res.status).toBe(200);

      const cookies = res.headers["set-cookie"];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/token=.*;/);
    }, 15000);

    it("debería fallar con credenciales incorrectas", async () => {
      await request(app).post("/auth/register").send({
        email: "admin@mail.com",
        password: "admin123",
      });

      const res = await request(app).post("/auth/login").send({
        email: "admin@mail.com",
        password: "claveIncorrecta",
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBeDefined();
    }, 15000);

    it("debería rechazar si faltan campos", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "admin@mail.com", // Falta password
      });

      expect(res.status).toBe(401); // Ya que tu lógica actual no valida campos faltantes
    }, 15000);
  });

  describe("POST /auth/register", () => {
    it("debería registrar un nuevo usuario", async () => {
      const res = await request(app).post("/auth/register").send({
        email: "nuevo@mail.com",
        password: "passSegura123",
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Usuario registrado correctamente");
    }, 15000);
  });

  describe("GET /auth/verify", () => {
    it("debería rechazar acceso sin token", async () => {
      const res = await request(app).get("/auth/verify");
      expect(res.status).toBe(401);
    });

    it("debería permitir acceso con token válido", async () => {
      await request(app).post("/auth/register").send({
        email: "admin@mail.com",
        password: "admin123",
      });

      const loginRes = await request(app).post("/auth/login").send({
        email: "admin@mail.com",
        password: "admin123",
      });

      const cookies = loginRes.headers["set-cookie"];
      expect(cookies).toBeDefined();

      const verifyRes = await request(app)
        .get("/auth/verify")
        .set("Cookie", cookies);

      expect(verifyRes.status).toBe(200);
      expect(verifyRes.body.authenticated).toBe(true);
      expect(verifyRes.body.userId).toBeDefined();
    }, 15000);
  });
});
