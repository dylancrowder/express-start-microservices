/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppError } from "@ecomerce/common";
import { CreateOrderDTO } from "./orderDTO";
import OrderModel, { OrderDocument } from "./orders.schema";
import { CreateOrderItemDTO } from "../order_items/order.itemsDTO";
import { OrderItemService } from "../order_items/order.items.services";

export class OrderService {
  // CREAR ORDEN
  /*   static async createOrder(body: CreateOrderDTO): Promise<OrderDocument> {
    try {
      const newOrder = await OrderModel.create(body);
      return await newOrder.save();
    } catch (error: any) {
      throw new AppError(
        "InternalServerError",
        500,
        error,
        "Error interno del servidor al crear la orden.",
        true
      );
    }
  } */

  // CREAR ORDEN CON MÚLTIPLES ITEMS
  static async createOrder(
    orderData: {
      user_id: number;
      admin_id?: number;
      payment_type?: string;
      payment_status?: string;
    },
    items: CreateOrderItemDTO[]
  ): Promise<OrderDocument> {
    try {
      if (!items || items.length === 0) {
        throw new AppError(
          "BadRequest",
          400,
          null,
          "La orden debe tener al menos un item.",
          true
        );
      }

      const processedItems = [];
      let orderTotal = 0;

      // Procesar cada item usando tu función createOrderItem
      for (const itemData of items) {
        const orderItem = await OrderItemService.createOrderItem(itemData);
        processedItems.push(orderItem);
        orderTotal += orderItem.total;
      }

      // Crear la orden con todos los items
      const newOrder = await OrderModel.create({
        ...orderData,
        items: processedItems,
        total: orderTotal,
        status: "pending",
      });

      return await newOrder.save();
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "InternalServerError",
        500,
        error,
        "Error al crear la orden.",
        true
      );
    }
  }

  // AGREGAR ITEM A UNA ORDEN EXISTENTE
  static async addItemToExistingOrder(
    orderId: string,
    itemData: CreateOrderItemDTO
  ): Promise<OrderDocument> {
    try {
      // Procesar el nuevo item
      const newItem = await OrderItemService.createOrderItem(itemData);

      // Buscar la orden existente
      const order = await OrderModel.findById(orderId);
      if (!order) {
        throw new AppError("NotFound", 404, null, "Orden no encontrada.", true);
      }

      // Agregar el item al array
      if (!order.items) {
        order.items = [];
      }
      order.items.push(newItem);

      // Recalcular el total
      order.total = order.items.reduce(
        (sum: number, item: any) => sum + item.total,
        0
      );

      return await order.save();
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "InternalServerError",
        500,
        error,
        "Error al agregar item a la orden.",
        true
      );
    }
  }

  // OBTENER TODAS LAS ORDENES
  static async getAllOrders(): Promise<OrderDocument[]> {
    try {
      const orders = await OrderModel.find();
      return orders;
    } catch (error: any) {
      throw new AppError(
        "InternalServerError",
        500,
        error,
        "Error interno del servidor al obtener las órdenes.",
        true
      );
    }
  }

  // ELIMINAR UNA ORDEN
  static async deleteOneOrder(id: string): Promise<{ deleted: boolean }> {
    try {
      const result = await OrderModel.deleteOne({ _id: id });
      return { deleted: result.deletedCount > 0 };
    } catch (error: any) {
      throw new AppError(
        "InternalServerError",
        500,
        error,
        "Error interno del servidor, no se pudo eliminar la orden."
      );
    }
  }

  // EDITAR UNA ORDEN
  static async editOneOrder(
    id: string,
    updateData: Partial<CreateOrderDTO>
  ): Promise<OrderDocument | null> {
    try {
      const updatedOrder = await OrderModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      return updatedOrder;
    } catch (error: any) {
      throw new AppError(
        "InternalServerError",
        500,
        error,
        "Error interno del servidor, no se pudo editar la orden."
      );
    }
  }
}
