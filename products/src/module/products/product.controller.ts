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
  static getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const products = await ProductService.getAllProducts();
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  };

  static async deleteOneProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const deletedProduct = await ProductService.deleteOneProduct(id);

      if (!deletedProduct) {
        // Si no se encontró el producto, lanzar error 404
        throw new AppError(
          "notFound",
          404,
          null,
          `No se encontró el producto con id ${id}`
        );
      }

      res.status(200).json({
        message: "Producto eliminado con éxito",
        data: deletedProduct,
      });
    } catch (error) {
      next(error); // pasa el error al middleware de manejo de errores
    }
  }

  static async editOneProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const editedProduct = await ProductService.editOneProduct(id, updateData);

      if (!editedProduct) {
        throw new AppError(
          "notFound",
          404,
          null,
          `No se encontró el producto con id ${id}`
        );
      }

      res.status(200).json({
        message: "Producto actualizado con éxito",
        data: editedProduct,
      });
    } catch (error) {
      next(error);
    }
  }
}
