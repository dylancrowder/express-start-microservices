/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppError } from "@ecomerce/common";

import OrderItemModel, { OrderItemDocument } from "./order.items.schema";
import { CreateOrderItemDTO } from "./order.itemsDTO";
import { ProductService } from "../products/products.services";
import { Product } from "../products/productDTO";

export class OrderItemService {
  // CREAR ORDEN
  static async createOrderItem(body: CreateOrderItemDTO): Promise<any> {
    // Cambiar el tipo de retorno
    try {
      const { product_id, custom_product_id, quantity } = body;

      // Validar que al menos uno de los dos IDs esté presente
      if (!product_id && !custom_product_id) {
        throw new AppError(
          "BadRequest",
          400,
          null,
          "Debe proporcionar product_id o custom_product_id.",
          true
        );
      }

      // Validar que no se proporcionen ambos al mismo tiempo
      if (product_id && custom_product_id) {
        throw new AppError(
          "BadRequest",
          400,
          null,
          "No puede proporcionar product_id y custom_product_id al mismo tiempo.",
          true
        );
      }

      let product: Product | undefined;
      let productPrice: Product["price"] = 0;
      let productName: Product["name"] = "";

      // Buscar en la tabla de productos normales
      if (product_id) {
        if (typeof product_id !== "string") {
          throw new AppError(
            "BadRequest",
            400,
            null,
            "El product_id debe ser un string.",
            true
          );
        }

        product = await ProductService.getOneProduct(product_id);
        if (!product) {
          throw new AppError(
            "NotFound",
            404,
            null,
            "Producto no encontrado.",
            true
          );
        }
        productPrice = product.price;
        productName = product.name;
      }

      // Buscar en la tabla de productos personalizados
      /*    if (custom_product_id) {
        if (typeof custom_product_id !== "string") {
          throw new AppError(
            "BadRequest",
            400,
            null,
            "El custom_product_id debe ser un string.",
            true
          );
        }

        // ✅ CORREGIR: Buscar el producto personalizado
        product = await CustomProductService.getOneCustomProduct(
          custom_product_id
        );
        if (!product) {
          throw new AppError(
            "NotFound",
            404,
            null,
            "Producto personalizado no encontrado.",
            true
          );
        }
        productPrice = product.price; // ✅ CORREGIR: Usar el precio del producto encontrado
        productName = product.name;
      } */

      // Calcular precio total
      const totalPrice = productPrice * quantity;

      // ✅ Retornar los datos del item (no guardar en DB)
      const orderItemData = {
        product_id: product_id || null,
        custom_product_id: custom_product_id || null,
        product_name: productName,
        price: productPrice,
        quantity: quantity,
        total: totalPrice,
      };

      return orderItemData;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        "InternalServerError",
        500,
        error,
        "Error interno del servidor al procesar el item.",
        true
      );
    }
  }

  // OBTENER TODAS LAS ORDENES
  static async getAllOrders(): Promise<OrderItemDocument[]> {
    try {
      const orders = await OrderItemModel.find();
      return orders;
    } catch (error: any) {
      throw new AppError(
        "InternalServerError",
        500,
        error,
        "Error interno del servidor al obtener las órdenes.",
        true
      );
    }
  }

  // ELIMINAR UNA ORDEN
  static async deleteOneOrder(id: string): Promise<{ deleted: boolean }> {
    try {
      const result = await OrderItemModel.deleteOne({ _id: id });
      return { deleted: result.deletedCount > 0 };
    } catch (error: any) {
      throw new AppError(
        "InternalServerError",
        500,
        error,
        "Error interno del servidor, no se pudo eliminar la orden."
      );
    }
  }

  // EDITAR UNA ORDEN
  static async editOneOrder(
    id: string,
    updateData: Partial<CreateOrderItemDTO>
  ): Promise<OrderItemDocument | null> {
    try {
      const updatedOrder = await OrderItemModel.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

      return updatedOrder;
    } catch (error: any) {
      throw new AppError(
        "InternalServerError",
        500,
        error,
        "Error interno del servidor, no se pudo editar la orden."
      );
    }
  }
}
