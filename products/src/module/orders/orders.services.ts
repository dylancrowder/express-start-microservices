/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/orders/orders.service.ts
import { AppError } from "@ecomerce/common";
import OrderModel, { OrderDocument } from "./orders.schema";
import OrderItemModel from "../order_items/order.items.schema";
import { CreateOrderDTO } from "./orderDTO";

export class OrderService {
  // CREAR ORDEN
  static async createOrder(orderBody: CreateOrderDTO): Promise<OrderDocument> {
    try {
      // Validar items
      if (
        !orderBody.items ||
        !Array.isArray(orderBody.items) ||
        orderBody.items.length === 0
      ) {
        throw new AppError(
          "BadRequest",
          400,
          "Items are required to create an order.",
          "No items provided in the order.",
          true
        );
      }

      let total = 0;

      // Obtener los OrderItems existentes y calcular total
      const orderItemIds = await Promise.all(
        orderBody.items.map(async (itemId: any) => {
          const orderItem = await OrderItemModel.findById(itemId);

          if (!orderItem) {
            throw new AppError(
              "NotFound",
              404,
              `OrderItem con id ${itemId} no encontrado`,
              "No se encontró el item en la base de datos",
              true
            );
          }

          total += orderItem.total;
          return orderItem._id; // solo guardamos el ID
        })
      );

      // Crear la orden
      const newOrder = await OrderModel.create({
        ...orderBody,
        items: orderItemIds,
        total,
      });

      return newOrder;
    } catch (error: any) {
      throw new AppError(
        "InternalServerError",
        500,
        error.message || error,
        "Error interno del servidor al crear la orden.",
        true
      );
    }
  }
}
