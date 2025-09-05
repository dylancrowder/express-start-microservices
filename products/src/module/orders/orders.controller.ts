import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { OrderService } from "./orders.services";
import { OrderItemService } from "../order_items/order.items.services";

export class OrderController {
  // CREAR ORDEN
  static createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // 1. Crear los items
      console.log("Request Body (items):", req.body.items);

      const items = await OrderItemService.createManyItems(req.body.items);

      const orderData = {
        ...req.body,
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
