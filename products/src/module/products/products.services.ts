/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from "./productDTO";
import { ProductDocument } from "./product.schema";
import AppError from "../../utilities/error/appError";
import ProductModel from "./product.schema";

export class ProductService {
  static async createProduct(body: Product): Promise<ProductDocument> {
    try {
      const newProduct = await ProductModel.create(body);
      return await newProduct.save();
    } catch (error: any) {
      throw new AppError(
        "InternalServerError",
        500,
        error,
        "Error interno del servidor.",
        true
      );
    }
  }

  static async getAllProducts(): Promise<ProductDocument[]> {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (error: any) {
      throw new AppError(
        "InternalServerError",
        500,
        error,
        "Error interno del servidor al obtener los productos.",
        true
      );
    }
  }

  static async deleteOneProduct(id: string): Promise<{ deleted: boolean }> {
    try {
      const result = await ProductModel.deleteOne({ _id: id });

      return { deleted: result.deletedCount > 0 };
    } catch (error) {
      throw new AppError(
        "internalServerError",
        500,
        error,
        "error interno del servidor, no se pudo borrar tu producto"
      );
    }
  }

  static async editOneProduct(
    id: string,
    updateData: Partial<Product>
  ): Promise<Product | null> {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true, // para devolver el documento actualizado
          runValidators: true, // para validar los datos con el schema
        }
      );
      return updatedProduct;
    } catch (error) {
      throw new AppError(
        "internalServerError",
        500,
        error,
        "Error interno del servidor, no se pudo editar tu producto"
      );
    }
  }
}
