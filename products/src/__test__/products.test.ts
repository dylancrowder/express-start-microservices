import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";
import dotenv from "dotenv";
import { ProductDocument } from "../module/products/product.schema";

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

describe("ENDPOINTS DE PRODUCTOS #api #sanity", () => {
  describe("POST /create , crea un producto", () => {
    it("cuando se envían datos correctos se crea producto con status 201", async () => {
      const validProduct = {
        name: "Coca Cola",
        price: 12,
        stock: 23,
        description: "Coca cola 2L.",
      };

      const res = await request(app).post("/create").send(validProduct);

      expect(res.status).toBe(201);

      // Validar que `data` tenga todas las propiedades del producto
      expect(res.body).toMatchObject({
        name: "Coca Cola",
        price: 12,
        stock: 23,
        description: "Coca cola 2L.",
      });

      // Validar propiedades automáticas generadas
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("createdAt");
      expect(res.body).toHaveProperty("updatedAt");
      expect(res.body).toHaveProperty("__v", 0);
    });
  });

  describe("GET /find trae todos los productos", () => {
    beforeEach(async () => {
      // Insertar productos para la prueba
      await request(app).post("/create").send({
        name: "Papas FRITAS",
        price: 59,
        stock: 49,
        description: "Con cocacola",
      });
      await request(app).post("/create").send({
        name: "Coca Cola",
        price: 12,
        stock: 23,
        description: "Coca cola 2L.",
      });
    });

    it("debe devolver todos los productos con la estructura correcta", async () => {
      const res = await request(app).get("/find");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);

      res.body.forEach((product: ProductDocument) => {
        expect(product).toHaveProperty("_id");
        expect(product).toHaveProperty("name");
        expect(product).toHaveProperty("price");
        expect(product).toHaveProperty("stock");
        expect(product).toHaveProperty("description");
        expect(product).toHaveProperty("createdAt");
        expect(product).toHaveProperty("updatedAt");
        expect(product).toHaveProperty("__v", 0);
      });

      // Validar que uno de los productos sea "Papas FRITAS"
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Papas FRITAS",
            price: 59,
            stock: 49,
            description: "Con cocacola",
          }),
        ])
      );
    });
  });

  describe("DELETE /deleteOne/:id elimina un producto", () => {
    let createdProductId: string;

    beforeEach(async () => {
      const res = await request(app).post("/create").send({
        name: "Producto a eliminar",
        price: 30,
        stock: 10,
        description: "Producto temporal para prueba de eliminación",
      });
      createdProductId = res.body._id;
    });

    it("debe eliminar un producto y devolver mensaje de éxito", async () => {
      const res = await request(app).delete(`/deleteOne/${createdProductId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Producto eliminado con éxito"
      );
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toEqual({ deleted: true });
    });

    it("debe devolver 404 si el producto no existe", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).delete(`/deleteOne/${fakeId}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    it("debe devolver 400 si el id es inválido", async () => {
      const invalidId = "123-invalid-id";
      const res = await request(app).delete(`/deleteOne/${invalidId}`);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toMatch(/inválido/i);
    });
  });

  describe("PATCH /editOne/:id actualiza un producto", () => {
    let createdProductId: string;

    beforeEach(async () => {
      const res = await request(app).post("/create").send({
        name: "Producto a editar",
        price: 50,
        stock: 20,
        description: "Producto temporal para prueba de edición",
      });
      createdProductId = res.body._id;
    });

    it("debe actualizar un producto y devolver la estructura correcta", async () => {
      const updateData = { price: 100, stock: 100 };

      const res = await request(app)
        .patch(`/editOne/${createdProductId}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Producto actualizado con éxito"
      );

      const product = res.body.data;
      expect(product).toHaveProperty("_id", createdProductId);
      expect(product).toHaveProperty("name", "Producto a editar");
      expect(product).toHaveProperty("price", 100);
      expect(product).toHaveProperty("stock", 100);
      expect(product).toHaveProperty(
        "description",
        "Producto temporal para prueba de edición"
      );
      expect(product).toHaveProperty("createdAt");
      expect(product).toHaveProperty("updatedAt");
      expect(product).toHaveProperty("__v", 0);
    });

    it("debe devolver 400 si el id es inválido", async () => {
      const invalidId = "123-invalid-id";
      const res = await request(app).patch(`/editOne/${invalidId}`).send({
        name: "Nuevo nombre",
        price: 100,
        stock: 50,
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toMatch(/inválido/i);
    });

    it("debe devolver 404 si el producto no existe", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).patch(`/editOne/${fakeId}`).send({
        price: 200,
      });
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message");
    });
  });
});
