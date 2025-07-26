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
}
