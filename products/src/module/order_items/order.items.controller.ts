// src/controllers/order.controller.ts
import { Request, Response, NextFunction } from "express";

import { OrderItemService } from "./order.items.services";

export class OrderItemsController {
  // CREAR ORDEN
  static createOrderItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const newOrder = await OrderItemService.createManyItems(req.body);
      res.status(201).json(newOrder);
    } catch (err) {
      next(err);
    }
  };
}
