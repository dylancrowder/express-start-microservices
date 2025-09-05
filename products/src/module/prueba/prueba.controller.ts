// src/controllers/Prueba.controller.ts
import { Request, Response, NextFunction } from "express";
import { PruebaService } from "./prueba.service";

export class PruebaController {
  // CREAR ORDEN
  static createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // 1. Crear los items (pueden ser uno o varios)
      const items = await PruebaService.createManyItems(req.body.item);

      // 2. Crear la orden, pasando los items creados
      const orderData = {
        ...req.body,
        item: items.map((i) => i._id),
      };

      const order = await PruebaService.createOrder(orderData);

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

  static createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const prueba = await PruebaService.createProduct(req.body);

      res.status(201).json({
        success: true,
        data: prueba,
      });
    } catch (err) {
      next(err);
    }
  };

  // get

  static getProdct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const prueba = await PruebaService.getProduct();

      res.status(200).json(prueba);
    } catch (error) {
      next(error);
    }
  };

  static getOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const prueba = await PruebaService.getOrders();

      res.status(200).json(prueba);
    } catch (error) {
      next(error);
    }
  };
}
