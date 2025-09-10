import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { OrderService } from "./orders.services";
import { OrderItemService } from "../order_items/order.items.services";
import { AppError, createOrderSchema } from "@ecomerce/common";

export class OrderController {
  // CREAR ORDEN
  static createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { error, value } = createOrderSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: false,
      });

      if (error) {
        throw new AppError(
          "ValidationError",
          400,
          error,
          "Datos inválidos. Por favor, revisa los campos de la orden.",
          true
        );
      }

      // ✅ Datos del usuario enviados por el gateway
      const userId = req.headers["x-user-id"] as string;
      const userRole = req.headers["x-user-role"] as string;

      console.log("este es el userId", userId);
      console.log("este es el role", userRole);

      if (!userId) {
        throw new AppError(
          "Unauthorized",
          401,
          {},
          "Usuario no autenticado",
          true
        );
      }

      // 🔥 Asociar orden al usuario autenticado
      const items = await OrderItemService.createManyItems(value.items);
      const orderData = {
        ...value,
        admin_id: new Types.ObjectId(userId),
        items: items.map((i) => i._id as Types.ObjectId),
      };
      console.log("esta es lña oden ", orderData);

      const order = await OrderService.createOrder(orderData);

      res.status(201).json({
        success: true,
        message: "Orden creada exitosamente",
        data: order,
      });
    } catch (err) {
      next(err);
    }
  };
}
