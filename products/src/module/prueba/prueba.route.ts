import express from "express";
import { PruebaController } from "./prueba.controller";

const router = express.Router();

// Crear un nuevo pedido
router.post("/create_order", PruebaController.createOrder);
router.post("/create_product", PruebaController.createProduct);
router.get("/get", PruebaController.getProdct);
router.get("/getOrder", PruebaController.getOrder);
export default router;
