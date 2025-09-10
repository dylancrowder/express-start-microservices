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
      // pasar el req.user

      // pasar req.admin

      const items = await OrderItemService.createManyItems(value.items);
      const orderData = {
        ...value,
        items: items.map((i) => i._id as Types.ObjectId),
      };

      const order = await OrderService.createOrder(orderData);

      // 3. Respuesta
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
