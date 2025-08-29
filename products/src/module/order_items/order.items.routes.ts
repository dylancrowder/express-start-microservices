import express from "express";
import { OrderItemsController } from "./order.items.controller";

const router = express.Router();

// Crear un nuevo pedido
router.post("/create", OrderItemsController.createOrderItem);

// Obtener todos los pedidos
router.get("/find", OrderItemsController.getAllOrders);

// Editar un pedido por ID (por ejemplo cambiar status)
router.patch("/edit/:id", OrderItemsController.editOneOrder);

// Eliminar un pedido por ID
router.delete("/delete/:id", OrderItemsController.deleteOneOrder);

export default router;
