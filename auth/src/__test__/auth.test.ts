import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";
import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  await mongoose.connection.db?.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

// Grupo de tests para la ruta POST /register
describe("ENDPOINT DE REGISTRO #api #sanity", () => {
  describe("Comprueba registro exitoso y fallas", () => {
    it("Cuando se envían email y contraseña válidos, entonces se registra el usuario con estado 201", async () => {
      const validUser = {
        email: "testuser@example.com",
        password: "password123",
      };

      const res = await request(app).post("/register").send(validUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "Usuario registrado correctamente."
      );
    });

    it("Cuando se envía un email ya registrado, entonces el registro falla con estado 409", async () => {
      const validUser = {
        email: "testuser@example.com",
        password: "password123",
      };
      await request(app).post("/register").send(validUser);

      const res = await request(app).post("/register").send(validUser);

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty(
        "message",
        "Ya existe un usuario con este correo."
      );
    });

    it("Cuando se envía un email con formato inválido, entonces el registro falla con estado 400", async () => {
      const invalidUser = { email: "correo-invalido", password: "password123" };

      const res = await request(app).post("/register").send(invalidUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    it("Cuando falta el campo contraseña, entonces el registro falla con estado 400", async () => {
      const incompleteUser = { email: "testuser@example.com" };

      const res = await request(app).post("/register").send(incompleteUser);

      expect(res.status).toBe(400);
    });
  });
});
