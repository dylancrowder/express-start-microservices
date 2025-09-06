/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "@ecomerce/common";
import OrderItemModel from "./order.items.schema";
import { OrderItem } from "./order.itemsDTO";
import { ProductService } from "../products/products.services";

export class OrderItemService {
  // Crear varios items
  static async createManyItems(bodies: OrderItem[]): Promise<OrderItem[]> {
    try {
      if (!Array.isArray(bodies) || bodies.length === 0) {
        throw new AppError(
          "BadRequest",
          400,
          "Los items no fueron enviados o están vacíos",
          "Debes enviar al menos un item para crear",
          true
        );
      }

      // Buscar los productos por id y armar los items completos
      const orderItemsToInsert = await Promise.all(
        bodies.map(async (item) => {
          if (!item.productId) {
            throw new AppError(
              "BadRequest",
              400,
              "El product_id es obligatorio",
              "No se puede crear el item sin product_id",
              true
            );
          }

          const product = await ProductService.getProductById(
            item.productId.toString()
          );

          if (!product) {
            throw new AppError(
              "NotFound",
              404,
              `Producto con id ${item.productId} no encontrado`,
              "No se pudo crear el item porque el producto no existe",
              true
            );
          }

          const price = product.price;
          const total = price * item.quantity;

          return {
            ...item,
            price,
            total,
          };
        })
      );

      // Insertar los items en la colección
      const newItems = await OrderItemModel.insertMany(orderItemsToInsert);
      return newItems;
    } catch (error: any) {
      throw new AppError(
        "InternalServerError",
        500,
        error,
        "Error interno del servidor al crear múltiples items.",
        true
      );
    }
  }
}
