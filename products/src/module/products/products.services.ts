/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from "./productDTO";

import { AppError } from "@ecomerce/common";
import ProductModel, { ProductDocument } from "./schemas/product.schema";
import { Types } from "mongoose";

export class ProductService {
  // CREAR PRODUCTO
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
  // OBTENER UN PRODUCTO
  static async getProductById(id: string): Promise<ProductDocument> {
    try {
      const product = await ProductModel.findById(id);
      if (product === null) {
        throw new AppError(
          "NotFound",
          404,
          null,
          "Producto no encontrado.",
          true
        );
      }
      return product;
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

  // OBTENER TODOS LOS PRODUCTOS
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

  static async getManyProductsByIds(
    idsArray: string[]
  ): Promise<ProductDocument[]> {
    try {
      // Convertir strings a ObjectId
      const objectIds = idsArray.map((id) => new Types.ObjectId(id));

      const products = await ProductModel.find({
        _id: { $in: objectIds },
      });
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  // EDITAR UN PRODUCTO
  static async editOneProduct(
    id: string,
    updateData: Partial<Product>
  ): Promise<Product | null> {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
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

  // ELIMINAR UN PRODUCTO
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
}
