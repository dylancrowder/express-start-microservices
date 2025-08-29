// src/controllers/order.controller.ts
import { Request, Response, NextFunction } from "express";
import { AppError, idSchema } from "@ecomerce/common";
import { OrderItemService } from "./order.items.services";

export class OrderItemsController {
  // CREAR ORDEN
  static createOrderItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validación
      /*   const { error, value } = createOrderSchema.validate(req.body, {
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
      } */

      const newOrder = await OrderItemService.createOrderItem(req.body);
      res.status(201).json(newOrder);
    } catch (err) {
      next(err);
    }
  };

  // CONSEGUIR TODAS LAS ORDENES
  static getAllOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const orders = await OrderItemService.getAllOrders();
      res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  };

  // ELIMINAR UNA ORDEN
  static async deleteOneOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { error, value } = idSchema.validate({ id: req.params.id });

      if (error) {
        throw new AppError(
          "ValidationError",
          400,
          error,
          "Datos inválidos. Por favor, revisa los campos de la orden.",
          true
        );
      }

      const { id } = value;

      const deletedOrder = await OrderItemService.deleteOneOrder(id);

      if (!deletedOrder.deleted) {
        throw new AppError(
          "notFound",
          404,
          null,
          `No se encontró la orden con id ${id}`
        );
      }

      res.status(200).json({
        message: "Orden eliminada con éxito",
        data: deletedOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  // EDITAR UNA ORDEN
  static async editOneOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { error, value } = idSchema.validate({ id: req.params.id });

      if (error) {
        throw new AppError(
          "ValidationError",
          400,
          error,
          "Datos inválidos. Por favor, revisa los campos de la orden.",
          true
        );
      }

      const { id } = value;
      const updateData = req.body;

      const editedOrder = await OrderItemService.editOneOrder(id, updateData);

      if (!editedOrder) {
        throw new AppError(
          "notFound",
          404,
          null,
          `No se encontró la orden con id ${id}`
        );
      }

      res.status(200).json({
        message: "Orden actualizada con éxito",
        data: editedOrder,
      });
    } catch (error) {
      next(error);
    }
  }
}
