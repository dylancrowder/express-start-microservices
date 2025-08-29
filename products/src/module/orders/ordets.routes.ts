import express from "express";

import { OrderController } from "./orders.controller";

const router = express.Router();

// Crear un nuevo pedido
router.post(
  "/create",

  OrderController.createOrder
);

// Obtener todos los pedidos
router.get("/find", OrderController.getAllOrders);

// Editar un pedido por ID (por ejemplo cambiar status)
router.patch("/edit/:id", OrderController.editOneOrder);

// Eliminar un pedido por ID
router.delete("/delete/:id", OrderController.deleteOneOrder);

export default router;
