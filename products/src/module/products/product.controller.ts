// src/controllers/product.controller.ts
import { Request, Response, NextFunction } from "express";
import AppError from "../../utilities/error/appError";
import { createProductSchema } from "../../utilities/joi";
import { ProductService } from "./products.services";

export class ProductController {
  static createProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validación
      const { error, value } = createProductSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: false,
      });

      if (error) {
        throw new AppError(
          "ValidationError",
          400,
          error.details.map((d) => d.message).join(", "),
          "Datos inválidos. Por favor, revisa los campos del producto.",
          true
        );
      }

      const newProduct = await ProductService.createProduct(value);
      res.status(201).json(newProduct);
    } catch (err) {
      next(err);
    }
  };
}
