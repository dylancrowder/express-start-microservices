import dotenv from "dotenv";
dotenv.config({ path: `.env.development` });

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

// Email usado para pruebas de duplicación
const testEmail = "duplicado@hotmail.com";
const testPassword = "123456";
describe("POST /register", () => {
  it("debería registrar un nuevo usuario", async () => {
    const res = await request(app).post("/register").send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).toBe(201);
  });

  it("debería rechazar si ya existe el usuario", async () => {
    const res = await request(app).post("/register").send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).toBe(409);
  });

  it("debería rechazar si los datos son inválidos", async () => {
    const res = await request(app).post("/register").send({
      email: "correo-no-valido",
      password: "12",
    });

    expect(res.status).toBe(400);
  });
});

describe("POST /login", () => {
  it("debería autenticar al usuario y devolver un token", async () => {
    const res = await request(app).post("/login").send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("debería fallar con contraseña incorrecta", async () => {
    const res = await request(app).post("/login").send({
      email: testEmail,
      password: "claveIncorrecta",
    });

    expect(res.status).toBe(401);
  });

  it("debería fallar si el usuario no existe", async () => {
    const res = await request(app).post("/login").send({
      email: "inexistente@example.com",
      password: "123456",
    });

    expect(res.status).toBe(404);
  });

  it("debería fallar si faltan campos", async () => {
    const res = await request(app).post("/login").send({
      email: testEmail,
      // Falta password
    });

    expect(res.status).toBe(400);
  });
});
